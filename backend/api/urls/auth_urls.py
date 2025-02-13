from django.urls import path
from ..views.oauth_views import GoogleSocialAuthView
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('google/', GoogleSocialAuthView.as_view(), name='google_auth'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]