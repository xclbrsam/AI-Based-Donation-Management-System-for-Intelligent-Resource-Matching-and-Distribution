from django.urls import path

from .views import (
    # =====================================================
    # REGISTRATION
    # =====================================================
    RegistrationView,
    DonorDetailView,

    # =====================================================
    # DONATION
    # =====================================================
    DonationCreateView,
    DonationDetailView,
    DonationStatusUpdateView,
    DonationImageAnalysisView,

    # =====================================================
    # NGO
    # =====================================================
    NGOCreateView,
    NGODetailView,
    ApprovedNGOListView,
    NGODonationListView,

    # =====================================================
    # NGO REQUIREMENTS
    # =====================================================
    NGORequirementListCreateView,
    NGORequirementDetailView,

    # =====================================================
    # DONATION MATCHING / ALLOCATION
    # =====================================================
    MatchingNGOView,
    AIMatchView,
    DonationAllocationView,
    NGODonationAllocationListView,

    # =====================================================
    # DONOR
    # =====================================================
    DonorDonationListView,

    # =====================================================
    # LOGIN
    # =====================================================
    LoginView,

    # =====================================================
    # DASHBOARD
    # =====================================================
    dashboard,

    # =====================================================
    # PROFILE
    # =====================================================
    profile,
    upload_profile_image,
    upload_ngo_certificate,
)


urlpatterns = [

    # =====================================================
    # REGISTRATION
    # =====================================================

    path(
        "register/",
        RegistrationView.as_view(),
        name="register"
    ),

    path(
        "register/<int:pk>/",
        DonorDetailView.as_view(),
        name="donor-detail"
    ),


    # =====================================================
    # DONATION
    # =====================================================

    path(
        "donation/",
        DonationCreateView.as_view(),
        name="donation-create"
    ),

    path(
        "donation/<int:pk>/",
        DonationDetailView.as_view(),
        name="donation-detail"
    ),

    path(
        "donation/<int:pk>/status/",
        DonationStatusUpdateView.as_view(),
        name="donation-status"
    ),


    # =====================================================
    # AI IMAGE ANALYSIS
    # =====================================================

    path(
        "donation/analyze/",
        DonationImageAnalysisView.as_view(),
        name="donation-image-analysis"
    ),


    # =====================================================
    # NGO
    # =====================================================

    path(
        "ngo/<int:pk>/",
        NGODetailView.as_view(),
        name="ngo-detail"
    ),

    path(
        "ngos/all/",
        NGOCreateView.as_view(),
        name="ngo-list"
    ),

    path(
        "ngos/",
        ApprovedNGOListView.as_view(),
        name="approved-ngos"
    ),


    # =====================================================
    # NGO DONATION REQUESTS
    # =====================================================

    path(
        "ngo/donations/",
        NGODonationListView.as_view(),
        name="ngo-donations"
    ),


    # =====================================================
    # NGO REQUIREMENTS
    # =====================================================

    path(
        "ngo/requirements/",
        NGORequirementListCreateView.as_view(),
        name="ngo-requirements"
    ),

    path(
        "ngo/requirements/<int:pk>/",
        NGORequirementDetailView.as_view(),
        name="ngo-requirement-detail"
    ),


    # =====================================================
    # DONATION MATCHING
    # =====================================================

    # -----------------------------------------------------
    # DONOR MATCHING
    # -----------------------------------------------------
    #
    # Finds NGOs that actually need the donated item.
    #
    # Example:
    #
    # Donation:
    # Books = 5
    #
    # NGO A:
    # Books = 10
    #
    # NGO B:
    # Rice = 20
    #
    # Result:
    # NGO A only
    #
    # NGO A can receive:
    # min(5, 10) = 5

    path(
        "donation/<int:pk>/matching-ngos/",
        MatchingNGOView.as_view(),
        name="matching-ngos"
    ),


    # -----------------------------------------------------
    # AI MATCHING
    # -----------------------------------------------------
    #
    # AI recommends the best NGO based on:
    #
    # 1. Item match
    # 2. Category
    # 3. Remaining requirement
    # 4. Priority / urgency
    # 5. Quantity compatibility
    #
    # Example:
    #
    # Donor:
    # Books = 5
    #
    # NGO A:
    # Books = 10
    # Priority = Normal
    #
    # NGO B:
    # Books = 5
    # Priority = Urgent
    #
    # AI recommends:
    # NGO B
    #
    # Recommended quantity:
    # min(5, 5) = 5

    path(
        "donation/<int:pk>/ai-matching/",
        AIMatchView.as_view(),
        name="ai-matching"
    ),


    # =====================================================
    # DONATION ALLOCATION
    # =====================================================

    # Allocate donation quantity to NGO requirements.

    path(
        "donation/<int:pk>/allocate/",
        DonationAllocationView.as_view(),
        name="donation-allocation"
    ),


    # =====================================================
    # NGO ALLOCATED DONATIONS
    # =====================================================

    path(
        "ngo/allocations/",
        NGODonationAllocationListView.as_view(),
        name="ngo-allocations"
    ),


    # =====================================================
    # LOGIN
    # =====================================================

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),


    # =====================================================
    # DASHBOARD
    # =====================================================

    path(
        "dashboard/",
        dashboard,
        name="dashboard"
    ),


    # =====================================================
    # PROFILE
    # =====================================================

    path(
        "profile/",
        profile,
        name="profile"
    ),


    # =====================================================
    # PROFILE IMAGE
    # =====================================================

    path(
        "profile/upload/",
        upload_profile_image,
        name="profile-upload"
    ),


    # =====================================================
    # NGO CERTIFICATE
    # =====================================================

    path(
        "ngo/certificate/upload/",
        upload_ngo_certificate,
        name="upload-ngo-certificate"
    ),


    # =====================================================
    # DONOR MY DONATIONS
    # =====================================================

    path(
        "my-donations/",
        DonorDonationListView.as_view(),
        name="my-donations"
    ),

]