from django.db import models
from django.conf import settings


class Donation(models.Model):

    CATEGORY_CHOICES = [
        ("Food", "Food"),
        ("Clothes", "Clothes"),
        ("Books", "Books"),
        ("Medicine", "Medicine"),
        ("Electronics", "Electronics"),
        ("Other", "Other"),
    ]

    STATUS_CHOICES = [
    ("AVAILABLE", "Available"),
    ("ACCEPTED", "Accepted"),
    ("COMPLETED", "Completed"),
]

    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    item_name = models.CharField(max_length=100)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    quantity = models.PositiveIntegerField()
    description = models.TextField()
    location = models.CharField(max_length=100)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )
    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default="AVAILABLE"
)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.item_name