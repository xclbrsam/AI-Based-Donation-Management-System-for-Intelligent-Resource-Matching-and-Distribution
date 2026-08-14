from django.contrib import admin
from .models import Donor, Donation, NGO


# =========================================================
# DONOR
# =========================================================

@admin.register(Donor)
class DonorAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "email",
        "phone",
        "city",
        "state",
        "status_active",
        "registered_date",
    )

    search_fields = (
        "name",
        "email",
        "phone",
    )


# =========================================================
# NGO
# =========================================================

@admin.register(NGO)
class NGOAdmin(admin.ModelAdmin):

    # IMPORTANT:
    # NGO name will be clickable
    list_display = (
        "id",
        "ngo_name",
        "registration_no",
        "email_id",
        "phone_no",
        "city",
        "state",
        "status",
        "registered_at",
    )

    list_display_links = (
        "ngo_name",
    )

    search_fields = (
        "ngo_name",
        "registration_no",
        "email_id",
        "phone_no",
    )

    list_filter = (
        "status",
        "state",
        "city",
    )

    ordering = (
        "-registered_at",
    )


# =========================================================
# DONATION
# =========================================================

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "item_name",
        "category",
        "donor",
        "ngo",
        "quantity",
        "condition",
        "status",
        "donation_date",
    )

    list_display_links = (
        "item_name",
    )

    search_fields = (
        "item_name",
        "donor__name",
        "donor__email",
        "ngo__ngo_name",
    )

    list_filter = (
        "category",
        "condition",
        "status",
    )

    list_select_related = (
        "donor",
        "ngo",
    )