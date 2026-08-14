from rest_framework import serializers
from django.contrib.auth.hashers import make_password

from .models import (
    Donor,
    NGO,
    Donation,
    NGORequirement,
    DonationAllocation,
)


# =========================================================
# DONOR SERIALIZER
# =========================================================

class DonorSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = Donor
        fields = "__all__"

    def validate_email(self, value):

        if Donor.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def validate_password(self, value):

        if len(value) < 6:

            raise serializers.ValidationError(
                "Password must contain at least 6 characters."
            )

        return value

    def create(self, validated_data):

        validated_data["password"] = make_password(
            validated_data["password"]
        )

        return Donor.objects.create(
            **validated_data
        )


# =========================================================
# NGO SERIALIZER
# =========================================================

class NGOSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True
    )

    class Meta:
        model = NGO
        fields = "__all__"

    def validate_email_id(self, value):

        if NGO.objects.filter(
            email_id=value
        ).exists():

            raise serializers.ValidationError(
                "This email is already registered."
            )

        return value

    def validate_password(self, value):

        if len(value) < 6:

            raise serializers.ValidationError(
                "Password must contain at least 6 characters."
            )

        return value

    def create(self, validated_data):

        validated_data["password"] = make_password(
            validated_data["password"]
        )

        return NGO.objects.create(
            **validated_data
        )


# =========================================================
# NGO REQUIREMENT SERIALIZER
# =========================================================

class NGORequirementSerializer(
    serializers.ModelSerializer
):

    # -----------------------------------------------------
    # NGO NAME
    # -----------------------------------------------------

    ngo_name = serializers.CharField(
        source="ngo.ngo_name",
        read_only=True
    )

    # -----------------------------------------------------
    # REMAINING QUANTITY
    # -----------------------------------------------------

    remaining_quantity = serializers.IntegerField(
        read_only=True
    )

    # -----------------------------------------------------
    # FULFILLED STATUS
    # -----------------------------------------------------

    is_fulfilled = serializers.BooleanField(
        read_only=True
    )

    class Meta:

        model = NGORequirement

        fields = [
            "id",

            # ---------------- NGO ----------------
            "ngo",
            "ngo_name",

            # ---------------- ITEM ----------------
            "item_name",
            "category",

            # ---------------- QUANTITY ----------------
            "required_quantity",
            "fulfilled_quantity",
            "remaining_quantity",

            # ---------------- PRIORITY ----------------
            "priority",

            # ---------------- DESCRIPTION ----------------
            "description",

            # ---------------- STATUS ----------------
            "is_active",
            "is_fulfilled",

            # ---------------- DATE ----------------
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",

            # NGO is assigned automatically
            # from the logged-in NGO account.
            "ngo",

            "ngo_name",

            "fulfilled_quantity",

            "remaining_quantity",

            "is_fulfilled",

            "created_at",

            "updated_at",
        ]


# =========================================================
# DONATION SERIALIZER
# =========================================================

class DonationSerializer(
    serializers.ModelSerializer
):

    # -----------------------------------------------------
    # DONOR DETAILS
    # -----------------------------------------------------

    donor_name = serializers.CharField(
        source="donor.name",
        read_only=True
    )

    donor_email = serializers.EmailField(
        source="donor.email",
        read_only=True
    )

    donor_phone = serializers.CharField(
        source="donor.phone",
        read_only=True
    )

    # -----------------------------------------------------
    # NGO DETAILS
    # -----------------------------------------------------

    ngo_name = serializers.CharField(
        source="ngo.ngo_name",
        read_only=True
    )

    # -----------------------------------------------------
    # ALLOCATION DETAILS
    # -----------------------------------------------------

    allocated_quantity = serializers.SerializerMethodField()

    allocated_ngos = serializers.SerializerMethodField()

    remaining_quantity = serializers.SerializerMethodField()

    class Meta:

        model = Donation

        fields = [
            "id",

            # ---------------- DONOR ----------------
            "donor",
            "donor_name",
            "donor_email",
            "donor_phone",

            # ---------------- OLD NGO FIELD ----------------
            "ngo",
            "ngo_name",

            # ---------------- ITEM ----------------
            "item_name",
            "category",
            "quantity",
            "condition",
            "description",
            "location",
            "item_image",

            # ---------------- STATUS ----------------
            "status",

            # ---------------- ALLOCATION ----------------
            "allocated_quantity",
            "allocated_ngos",
            "remaining_quantity",

            # ---------------- DATE ----------------
            "donation_date",
        ]

        read_only_fields = [
            "id",

            "donor",
            "donor_name",
            "donor_email",
            "donor_phone",

            "ngo_name",

            "status",

            "allocated_quantity",
            "allocated_ngos",
            "remaining_quantity",

            "donation_date",
        ]

    # =====================================================
    # TOTAL ALLOCATED QUANTITY
    # =====================================================

    def get_allocated_quantity(self, obj):

        total = sum(
            allocation.allocated_quantity
            for allocation in obj.allocations.all()
            if allocation.status != "Rejected"
        )

        return total

    # =====================================================
    # REMAINING DONATION QUANTITY
    # =====================================================

    def get_remaining_quantity(self, obj):

        allocated = self.get_allocated_quantity(obj)

        remaining = obj.quantity - allocated

        return max(
            remaining,
            0
        )

    # =====================================================
    # ALLOCATED NGO DETAILS
    # =====================================================

    def get_allocated_ngos(self, obj):

        allocations = obj.allocations.select_related(
            "ngo",
            "requirement"
        ).all()

        result = []

        for allocation in allocations:

            if allocation.status == "Rejected":
                continue

            result.append({
                "ngo_id": allocation.ngo.id,

                "ngo_name": allocation.ngo.ngo_name,

                "allocated_quantity":
                    allocation.allocated_quantity,

                "status":
                    allocation.status,

                "requirement_id":
                    allocation.requirement.id
                    if allocation.requirement
                    else None,
            })

        return result


# =========================================================
# DONATION ALLOCATION SERIALIZER
# =========================================================

class DonationAllocationSerializer(
    serializers.ModelSerializer
):

    # -----------------------------------------------------
    # DONOR
    # -----------------------------------------------------

    donor_name = serializers.CharField(
        source="donation.donor.name",
        read_only=True
    )

    # -----------------------------------------------------
    # DONATION
    # -----------------------------------------------------

    item_name = serializers.CharField(
        source="donation.item_name",
        read_only=True
    )

    category = serializers.CharField(
        source="donation.category",
        read_only=True
    )

    donation_quantity = serializers.IntegerField(
        source="donation.quantity",
        read_only=True
    )

    # -----------------------------------------------------
    # NGO
    # -----------------------------------------------------

    ngo_name = serializers.CharField(
        source="ngo.ngo_name",
        read_only=True
    )

    # -----------------------------------------------------
    # REQUIREMENT
    # -----------------------------------------------------

    required_quantity = serializers.IntegerField(
        source="requirement.required_quantity",
        read_only=True
    )

    remaining_requirement = serializers.SerializerMethodField()

    class Meta:

        model = DonationAllocation

        fields = [
            "id",

            # ---------------- DONATION ----------------
            "donation",
            "donor_name",
            "item_name",
            "category",
            "donation_quantity",

            # ---------------- NGO ----------------
            "ngo",
            "ngo_name",

            # ---------------- REQUIREMENT ----------------
            "requirement",
            "required_quantity",
            "remaining_requirement",

            # ---------------- ALLOCATION ----------------
            "allocated_quantity",

            # ---------------- STATUS ----------------
            "status",

            # ---------------- DATE ----------------
            "allocated_at",
        ]

        read_only_fields = [
            "id",

            "donor_name",
            "item_name",
            "category",
            "donation_quantity",

            "ngo_name",

            "required_quantity",
            "remaining_requirement",

            "allocated_at",
        ]

    # =====================================================
    # REMAINING NGO REQUIREMENT
    # =====================================================

    def get_remaining_requirement(self, obj):

        if not obj.requirement:
            return 0

        return obj.requirement.remaining_quantity


# =========================================================
# LOGIN SERIALIZER
# =========================================================

class LoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(
        write_only=True
    )


# =========================================================
# SINGLE REGISTRATION SERIALIZER
# =========================================================

class SingleRegistrationSerializer(
    serializers.Serializer
):

    user_type = serializers.ChoiceField(
        choices=[
            ("donor", "Donor"),
            ("ngo", "NGO"),
        ]
    )

    data = serializers.DictField()