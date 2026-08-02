from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):

    ROLE_CHOICES = [
        ("ADMIN", "ADMIN"),
        ("DONOR", "DONOR"),
        ("NGO", "NGO"),
    ]

    name = models.CharField(max_length=100)

    phone = models.CharField(max_length=15)

    language_preference = models.CharField(
        max_length=50,
        blank=True
    )

    address = models.TextField(blank=True)

    city = models.CharField(max_length=100, blank=True)

    state = models.CharField(max_length=100, blank=True)

    pincode = models.CharField(max_length=10, blank=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="DONOR"
    )

    is_active = models.BooleanField(default=True)

    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username