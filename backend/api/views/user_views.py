from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import User
from ..serializers import UserSerializer
import logging  # Import the logging module

# Get an instance of a logger
logger = logging.getLogger(__name__)

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        logger.info(f"Fetched user details for user {request.user.email}")
        return Response(serializer.data)