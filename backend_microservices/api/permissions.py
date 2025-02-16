# api/permissions.py
from rest_framework import permissions
from django.conf import settings

class HasItem1Permission(permissions.BasePermission):
    """
    Custom permission to only allow users who own Item 1.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.items.filter(pk=settings.ITEM1_ID).exists()

class HasItem2Permission(permissions.BasePermission):
    """
    Custom permission to only allow users who own Item 2.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.items.filter(pk=settings.ITEM2_ID).exists()

class HasItem3Permission(permissions.BasePermission):
    """
    Custom permission to only allow users who own Item 3.
    """

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        return request.user.items.filter(pk=settings.ITEM3_ID).exists()