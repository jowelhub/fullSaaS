from django.urls import path
from ..views.item_views import Item3DashboardView

urlpatterns = [
    path('dashboard/', Item3DashboardView.as_view(), name='item3-dashboard'),
]