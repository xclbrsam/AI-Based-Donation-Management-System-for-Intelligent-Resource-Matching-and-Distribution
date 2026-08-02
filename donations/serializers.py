from rest_framework import serializers
from .models import Donation


class DonationSerializer(serializers.ModelSerializer):

    donor_name = serializers.ReadOnlyField(source="donor.username")

    class Meta:
        model = Donation
        fields = [
            "id",
            "donor",
            "donor_name",
            "item_name",
            "category",
            "quantity",
            "description",
            "location",
            "status",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "donor",
            "created_at",
        ]