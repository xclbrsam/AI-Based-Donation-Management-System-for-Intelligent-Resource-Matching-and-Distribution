from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):

    fieldsets = UserAdmin.fieldsets + (
        ("Additional Information", {
            "fields": (
                "name",
                "phone",
                "language_preference",
                "address",
                "city",
                "state",
                "pincode",
                "role",
                "registered_at",
            )
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Additional Information", {
            "fields": (
                "name",
                "phone",
                "language_preference",
                "address",
                "city",
                "state",
                "pincode",
                "role",
            )
        }),
    )

    readonly_fields = ("registered_at",)

    list_display = (
        "username",
        "email",
        "role",
        "is_staff",
        "is_superuser",
    )