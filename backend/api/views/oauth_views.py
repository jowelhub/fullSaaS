from google.oauth2 import id_token
from google.auth.transport import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
from api.models import User

class GoogleSocialAuthView(APIView):
    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({'error': 'Missing token'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Verify the Google ID token
            idinfo = id_token.verify_oauth2_token(token, requests.Request(), settings.GOOGLE_CLIENT_ID)

            # Get user info from the token
            email = idinfo['email']
            name = idinfo['name']

            # Register or login the user
            user, created = User.objects.get_or_create(
                email=email,
                defaults={'name': name}
            )

            # Generate a JWT for the user
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)