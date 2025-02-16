from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('api.urls.auth_urls')),
    path('api/v1/users/', include('api.urls.user_urls')),

    # Microservice URLs
    path('api/v1/item1/', include('api.urls.item1_urls')),
    path('api/v1/item2/', include('api.urls.item2_urls')),
    path('api/v1/item3/', include('api.urls.item3_urls')),
]