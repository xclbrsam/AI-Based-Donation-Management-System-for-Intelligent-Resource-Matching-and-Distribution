from django.db import models


# =========================================================
# DONOR
# =========================================================

class Donor(models.Model):

    name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=10
    )

    password = models.CharField(
        max_length=128
    )

    picture = models.ImageField(
        upload_to="donor_pictures/",
        null=True,
        blank=True
    )

    language_preference = models.CharField(
        max_length=50
    )

    address = models.TextField()

    city = models.CharField(
        max_length=100
    )

    state = models.CharField(
        max_length=100
    )

    pincode = models.CharField(
        max_length=6
    )

    status_active = models.BooleanField(
        default=True
    )

    registered_date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name

    @property
    def is_authenticated(self):
        return True


# =========================================================
# NGO
# =========================================================

class NGO(models.Model):

    ngo_name = models.CharField(
        max_length=200
    )

    picture = models.ImageField(
        upload_to="ngo_pictures/",
        null=True,
        blank=True
    )

    description = models.TextField()

    registration_no = models.CharField(
        max_length=100,
        unique=True
    )

    email_id = models.EmailField(
        unique=True
    )

    phone_no = models.CharField(
        max_length=10
    )

    website_link = models.URLField(
        blank=True
    )

    address = models.TextField()

    state = models.CharField(
        max_length=100
    )

    city = models.CharField(
        max_length=100
    )

    pincode = models.CharField(
        max_length=6
    )

    # -----------------------------------------------------
    # NGO STATUS
    # -----------------------------------------------------

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Approved", "Approved"),
        ("Rejected", "Rejected"),
    ]

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    # -----------------------------------------------------
    # LANGUAGE
    # -----------------------------------------------------

    language = models.CharField(
        max_length=50
    )

    # -----------------------------------------------------
    # CERTIFICATE
    # -----------------------------------------------------

    certificate_files = models.FileField(
        upload_to="ngo_certificates/",
        null=True,
        blank=True
    )

    # -----------------------------------------------------
    # REGISTRATION DATE
    # -----------------------------------------------------

    registered_at = models.DateTimeField(
        auto_now_add=True
    )

    # -----------------------------------------------------
    # PASSWORD
    # -----------------------------------------------------

    password = models.CharField(
        max_length=128
    )

    # -----------------------------------------------------
    # STRING
    # -----------------------------------------------------

    def __str__(self):
        return self.ngo_name

    @property
    def is_authenticated(self):
        return True


# =========================================================
# NGO REQUIREMENT
# =========================================================

class NGORequirement(models.Model):

    CATEGORY_CHOICES = [
        ("Clothing", "Clothing"),
        ("Books", "Books"),
        ("Food", "Food"),
        ("Electronics", "Electronics"),
        ("Furniture", "Furniture"),
        ("Medical Supplies", "Medical Supplies"),
        ("School Supplies", "School Supplies"),
        ("Other", "Other"),
    ]

    PRIORITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
        ("Urgent", "Urgent"),
    ]

    # -----------------------------------------------------
    # NGO
    # -----------------------------------------------------

    ngo = models.ForeignKey(
        NGO,
        on_delete=models.CASCADE,
        related_name="requirements"
    )

    # -----------------------------------------------------
    # REQUIRED ITEM
    # -----------------------------------------------------

    item_name = models.CharField(
        max_length=200
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    # -----------------------------------------------------
    # QUANTITY
    # -----------------------------------------------------

    required_quantity = models.PositiveIntegerField()

    fulfilled_quantity = models.PositiveIntegerField(
        default=0
    )

    # -----------------------------------------------------
    # PRIORITY
    # -----------------------------------------------------

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="Medium"
    )

    # -----------------------------------------------------
    # DESCRIPTION
    # -----------------------------------------------------

    description = models.TextField(
        blank=True
    )

    # -----------------------------------------------------
    # ACTIVE / INACTIVE
    # -----------------------------------------------------

    is_active = models.BooleanField(
        default=True
    )

    # -----------------------------------------------------
    # DATE
    # -----------------------------------------------------

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # -----------------------------------------------------
    # REMAINING QUANTITY
    # -----------------------------------------------------

    @property
    def remaining_quantity(self):

        remaining = (
            self.required_quantity
            - self.fulfilled_quantity
        )

        return max(
            remaining,
            0
        )

    # -----------------------------------------------------
    # CHECK WHETHER REQUIREMENT IS COMPLETED
    # -----------------------------------------------------

    @property
    def is_fulfilled(self):

        return (
            self.fulfilled_quantity
            >= self.required_quantity
        )

    # -----------------------------------------------------
    # STRING
    # -----------------------------------------------------

    def __str__(self):

        return (
            f"{self.ngo.ngo_name} - "
            f"{self.item_name} - "
            f"{self.remaining_quantity} needed"
        )


# =========================================================
# DONATION
# =========================================================

class Donation(models.Model):

    CATEGORY_CHOICES = [
        ("Clothing", "Clothing"),
        ("Books", "Books"),
        ("Food", "Food"),
        ("Electronics", "Electronics"),
        ("Furniture", "Furniture"),
        ("Medical Supplies", "Medical Supplies"),
        ("School Supplies", "School Supplies"),
        ("Other", "Other"),
    ]

    CONDITION_CHOICES = [
        ("New", "New"),
        ("Like New", "Like New"),
        ("Good", "Good"),
        ("Used", "Used"),
    ]

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Collected", "Collected"),
    ]

    # -----------------------------------------------------
    # DONOR
    # -----------------------------------------------------

    donor = models.ForeignKey(
        Donor,
        on_delete=models.CASCADE,
        related_name="donations"
    )

    # -----------------------------------------------------
    # NGO
    #
    # Kept for backward compatibility with your
    # existing project.
    #
    # For new intelligent matching, DonationAllocation
    # will be used.
    # -----------------------------------------------------

    ngo = models.ForeignKey(
        NGO,
        on_delete=models.CASCADE,
        related_name="donations",
        null=True,
        blank=True
    )

    # -----------------------------------------------------
    # ITEM DETAILS
    # -----------------------------------------------------

    item_name = models.CharField(
        max_length=200
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    quantity = models.PositiveIntegerField()

    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES
    )

    description = models.TextField()

    location = models.CharField(
        max_length=200
    )

    # -----------------------------------------------------
    # ITEM IMAGE
    # -----------------------------------------------------

    item_image = models.ImageField(
        upload_to="donation_items/",
        null=True,
        blank=True
    )

    # -----------------------------------------------------
    # DONATION STATUS
    # -----------------------------------------------------

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    # -----------------------------------------------------
    # DATE
    # -----------------------------------------------------

    donation_date = models.DateTimeField(
        auto_now_add=True
    )

    # -----------------------------------------------------
    # STRING
    # -----------------------------------------------------

    def __str__(self):

        return (
            f"{self.item_name} - "
            f"{self.donor.name}"
        )


# =========================================================
# DONATION ALLOCATION
# =========================================================
#
# This is the important model for your new requirement.
#
# Example:
#
# Donor donates 10 Books
#
# NGO A needs 3  → allocation = 3
# NGO B needs 5  → allocation = 5
# NGO C needs 2  → allocation = 2
#
# Total = 10
#
# One Donation can therefore be distributed to
# multiple NGOs.
# =========================================================

class DonationAllocation(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
        ("Collected", "Collected"),
    ]

    # -----------------------------------------------------
    # DONATION
    # -----------------------------------------------------

    donation = models.ForeignKey(
        Donation,
        on_delete=models.CASCADE,
        related_name="allocations"
    )

    # -----------------------------------------------------
    # NGO
    # -----------------------------------------------------

    ngo = models.ForeignKey(
        NGO,
        on_delete=models.CASCADE,
        related_name="donation_allocations"
    )

    # -----------------------------------------------------
    # NGO REQUIREMENT
    # -----------------------------------------------------

    requirement = models.ForeignKey(
        NGORequirement,
        on_delete=models.SET_NULL,
        related_name="allocations",
        null=True,
        blank=True
    )

    # -----------------------------------------------------
    # ALLOCATED QUANTITY
    # -----------------------------------------------------

    allocated_quantity = models.PositiveIntegerField()

    # -----------------------------------------------------
    # STATUS
    # -----------------------------------------------------

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    # -----------------------------------------------------
    # DATE
    # -----------------------------------------------------

    allocated_at = models.DateTimeField(
        auto_now_add=True
    )

    # -----------------------------------------------------
    # STRING
    # -----------------------------------------------------

    def __str__(self):

        return (
            f"{self.donation.item_name} → "
            f"{self.ngo.ngo_name} "
            f"({self.allocated_quantity})"
        )