from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('api.urls.auth_urls')),
    path('api/v1/users/', include('api.urls.user_urls')),
    path('api/v1/payments/', include('api.urls.payments_urls')),
]