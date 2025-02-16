from django.urls import path
from ..views.item_views import Item2ResizeView, Item2ConvertView

urlpatterns = [
    path('resize/', Item2ResizeView.as_view(), name='item2-resize'),
    path('convert/', Item2ConvertView.as_view(), name='item2-convert'),
]