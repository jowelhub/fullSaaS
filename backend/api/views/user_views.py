from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..serializers import UserSerializer, UserSubscriptionSerializer
from ..models import UserSubscription
import logging  # Import the logging module

# Get an instance of a logger
logger = logging.getLogger(__name__)

class UserDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        logger.info(f"Fetched user details for user {request.user.email}")
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = {'name': request.data.get('name', user.name)}
        serializer = UserSerializer(user, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            logger.info(f"Updated user name for user {user.email}")
            return Response(serializer.data)
        logger.error(f"Failed to update user name for user {user.email}: {serializer.errors}")
        return Response(serializer.errors, status=400)
    
    def patch(self, request):
        return self.put(request)

class SubscriptionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            subscription = UserSubscription.objects.get(user=request.user)
            serializer = UserSubscriptionSerializer(subscription)
            logger.info(f"Fetched subscription details for user {request.user.email}")
            return Response(serializer.data)
        except UserSubscription.DoesNotExist:
            logger.error(f"No subscription found for user {request.user.email}")
            return Response({"detail": "Subscription not found."}, status=404)