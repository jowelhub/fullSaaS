from django.urls import path
from ..views.user_views import UserDetailAPIView, SubscriptionDetailView

urlpatterns = [
    path('me/', UserDetailAPIView.as_view(), name='user-detail'),
    path('mysubscription/', SubscriptionDetailView.as_view(), name='subscription-detail'),
]
