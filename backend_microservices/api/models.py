from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.conf import settings

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    items = models.ManyToManyField('Item', related_name='users') # Add this line

    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

class Item(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

