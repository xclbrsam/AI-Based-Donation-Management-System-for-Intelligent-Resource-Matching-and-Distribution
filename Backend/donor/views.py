import os
import tempfile

from django.http import JsonResponse
from django.db.models import Sum
from django.contrib.auth.hashers import check_password

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from rest_framework_simplejwt.tokens import RefreshToken

from .models import Donor, NGO, Donation, NGORequirement, DonationAllocation, PickupRequest

from .serializers import (
    DonorSerializer,
    NGOSerializer,
    DonationSerializer,
    LoginSerializer,
    SingleRegistrationSerializer,
    NGORequirementSerializer,
    DonationAllocationSerializer,
    PickupRequestSerializer,
)


# =========================================================
# AI DONATION IMAGE ANALYSIS API
# =========================================================

class DonationImageAnalysisView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        # =================================================
        # GET IMAGE
        # =================================================

        image = request.FILES.get("image")

        if not image:
            return Response(
                {
                    "success": False,
                    "message": "Donation image is required.",
                    "items": []
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # VALIDATE IMAGE TYPE
        # =================================================

        allowed_types = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ]

        if image.content_type not in allowed_types:
            return Response(
                {
                    "success": False,
                    "message":
                        "Only JPG, JPEG, PNG and WEBP images are allowed.",
                    "items": []
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # VALIDATE IMAGE SIZE
        # =================================================

        max_size = 10 * 1024 * 1024  # 10 MB

        if image.size > max_size:
            return Response(
                {
                    "success": False,
                    "message":
                        "Image size must be less than 10 MB.",
                    "items": []
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        temporary_file = None

        try:

            # =================================================
            # CREATE TEMPORARY FILE
            # =================================================

            extension = os.path.splitext(
                image.name
            )[1]

            temporary_file = tempfile.NamedTemporaryFile(
                suffix=extension,
                delete=False
            )

            for chunk in image.chunks():
                temporary_file.write(chunk)

            temporary_file.close()

            # =================================================
            # IMPORT AI SCANNER
            # =================================================

            from ai.image_scanner import scan_image

            # =================================================
            # SEND IMAGE TO AI
            # =================================================

            result = scan_image(
                temporary_file.name
            )

            print(
                "========== AI RESULT =========="
            )
            print(result)
            print(
                "==============================="
            )

            # =================================================
            # CHECK AI RESULT
            # =================================================

            if not result.get("success"):
                return Response(
                    {
                        "success": False,
                        "message":
                            result.get(
                                "message",
                                "AI could not analyze the image."
                            ),
                        "items": []
                    },
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                )

            # =================================================
            # RETURN AI RESULT
            # =================================================

            return Response(
                {
                    "success": True,
                    "items":
                        result.get(
                            "items",
                            []
                        )
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:

            print(
                "========== AI API ERROR =========="
            )

            print(str(e))

            print(
                "=================================="
            )

            return Response(
                {
                    "success": False,
                    "message":
                        "AI image analysis failed.",
                    "items": []
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        finally:

            # =================================================
            # DELETE TEMPORARY FILE
            # =================================================

            if (
                temporary_file
                and os.path.exists(
                    temporary_file.name
                )
            ):
                os.remove(
                    temporary_file.name
                )


# =========================================================
# DASHBOARD API
# =========================================================

def dashboard(request):

    total_quantity = (
        Donation.objects.aggregate(
            total=Sum("quantity")
        )["total"] or 0
    )

    data = {
        "total_donors":
            Donor.objects.count(),

        "total_ngos":
            NGO.objects.count(),

        "total_donations":
            Donation.objects.count(),

        "pending_donations":
            Donation.objects.filter(
                status="Pending"
            ).count(),

        "accepted_donations":
            Donation.objects.filter(
                status="Accepted"
            ).count(),

        "rejected_donations":
            Donation.objects.filter(
                status="Rejected"
            ).count(),

        "collected_donations":
            Donation.objects.filter(
                status="Collected"
            ).count(),

        "total_items":
            total_quantity,
    }

    return JsonResponse(data)


# =========================================================
# SINGLE REGISTRATION API
# =========================================================

class RegistrationView(APIView):

    def post(self, request):

        # =================================================
        # DEBUG
        # =================================================

        print(
            "========== REGISTER REQUEST =========="
        )

        print(
            "DATA:",
            request.data
        )

        print(
            "FILES:",
            request.FILES
        )

        print(
            "======================================"
        )

        # =================================================
        # USER TYPE
        # =================================================

        user_type = request.data.get(
            "user_type"
        )

        if not user_type:

            return Response(
                {
                    "message":
                        "User type is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # DONOR REGISTRATION
        # =================================================

        if user_type == "donor":

            # -------------------------------------------------
            # Donor registration normally uses JSON
            # -------------------------------------------------

            data = request.data.get(
                "data"
            )

            if not data:

                return Response(
                    {
                        "message":
                            "Donor registration data is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            donor_serializer = DonorSerializer(
                data=data
            )

            if donor_serializer.is_valid():

                donor = donor_serializer.save()

                return Response(
                    {
                        "message":
                            "Donor Registered Successfully",

                        "user_type":
                            "Donor",

                        "id":
                            donor.id,

                        "name":
                            donor.name,

                        "email":
                            donor.email,
                    },
                    status=status.HTTP_201_CREATED
                )

            print(
                "DONOR SERIALIZER ERRORS:",
                donor_serializer.errors
            )

            return Response(
                donor_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # NGO REGISTRATION
        # =================================================

        elif user_type == "ngo":

            # -------------------------------------------------
            # NGO uses multipart/form-data.
            #
            # request.data contains normal fields.
            # request.FILES contains uploaded files.
            # -------------------------------------------------

            data = request.data.copy()

            # -------------------------------------------------
            # Remove user_type because it is not an NGO model
            # field.
            # -------------------------------------------------

            data.pop(
                "user_type",
                None
            )

            # =================================================
            # NGO LOGO
            # =================================================

            if "picture" in request.FILES:

                data["picture"] = request.FILES[
                    "picture"
                ]

            # =================================================
            # NGO CERTIFICATE
            # =================================================

            if "certificate_files" in request.FILES:

                data["certificate_files"] = request.FILES[
                    "certificate_files"
                ]

            # =================================================
            # DEBUG NGO DATA
            # =================================================

            print(
                "========== NGO DATA =========="
            )

            print(
                "NGO DATA:",
                data
            )

            print(
                "NGO FILES:",
                request.FILES
            )

            print(
                "=============================="
            )

            # =================================================
            # NGO SERIALIZER
            # =================================================

            ngo_serializer = NGOSerializer(
                data=data
            )

            # =================================================
            # VALIDATE AND SAVE
            # =================================================

            if ngo_serializer.is_valid():

                ngo = ngo_serializer.save()

                return Response(
                    {
                        "message":
                            "NGO Registered Successfully",

                        "user_type":
                            "NGO",

                        "id":
                            ngo.id,

                        "name":
                            ngo.ngo_name,

                        "email":
                            ngo.email_id,

                        "status":
                            ngo.status,

                        "certificate":
                            (
                                ngo.certificate_files.url
                                if ngo.certificate_files
                                else None
                            ),

                        "picture":
                            (
                                ngo.picture.url
                                if ngo.picture
                                else None
                            ),
                    },
                    status=status.HTTP_201_CREATED
                )

            # =================================================
            # NGO VALIDATION ERRORS
            # =================================================

            print(
                "========== NGO SERIALIZER ERRORS =========="
            )

            print(
                ngo_serializer.errors
            )

            print(
                "==========================================="
            )

            return Response(
                ngo_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        # =================================================
        # INVALID USER TYPE
        # =================================================

        return Response(
            {
                "message":
                    "Invalid user type."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# DONOR API
# =========================================================

class DonorDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Donor.objects.all()

    serializer_class = DonorSerializer


# =========================================================
# APPROVED NGO LIST API
# =========================================================

class ApprovedNGOListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        ngos = NGO.objects.filter(
            status="Approved"
        ).order_by(
            "ngo_name"
        )

        serializer = NGOSerializer(
            ngos,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# NGO CREATE API
# =========================================================

class NGOCreateView(
    generics.ListCreateAPIView
):

    queryset = NGO.objects.all()

    serializer_class = NGOSerializer


# =========================================================
# NGO DETAIL API
# =========================================================

class NGODetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = NGO.objects.all()

    serializer_class = NGOSerializer


# =========================================================
# ITEM DONATION API
# =========================================================

class DonationCreateView(
    generics.ListCreateAPIView
):

    queryset = Donation.objects.select_related(
        "donor",
        "ngo"
    ).all()

    serializer_class = DonationSerializer

    permission_classes = [
        IsAuthenticated
    ]

    def perform_create(
        self,
        serializer
    ):

        user_id = self.request.auth.get(
            "user_id"
        )

        user_type = self.request.auth.get(
            "user_type"
        )

        # -------------------------------------------------
        # ONLY DONORS CAN CREATE DONATIONS
        # -------------------------------------------------

        if user_type != "Donor":

            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "Only donors can donate items."
            )

        # -------------------------------------------------
        # FIND LOGGED-IN DONOR
        # -------------------------------------------------

        try:

            donor = Donor.objects.get(
                id=user_id
            )

        except Donor.DoesNotExist:

            from rest_framework.exceptions import NotFound

            raise NotFound(
                "Donor not found."
            )

        # -------------------------------------------------
        # SAVE DONATION
        # -------------------------------------------------

        serializer.save(
            donor=donor
        )


# =========================================================
# DONATION DETAIL API
# =========================================================

class DonationDetailView(
    generics.RetrieveUpdateDestroyAPIView
):

    queryset = Donation.objects.select_related(
        "donor",
        "ngo"
    ).all()

    serializer_class = DonationSerializer


# =========================================================
# PROFILE API
# =========================================================

@api_view(["GET"])
@permission_classes([
    IsAuthenticated
])
def profile(request):

    user_id = request.auth.get(
        "user_id"
    )

    user_type = request.auth.get(
        "user_type"
    )

    # =====================================================
    # DONOR PROFILE
    # =====================================================

    if user_type == "Donor":

        try:

            donor = Donor.objects.get(
                id=user_id
            )

            return Response(
                {
                    "message":
                        "Profile API Working Successfully",

                    "user_type":
                        "Donor",

                    "id":
                        donor.id,

                    "name":
                        donor.name,

                    "email":
                        donor.email,

                    "phone":
                        donor.phone,

                    "address":
                        donor.address,

                    "city":
                        donor.city,

                    "state":
                        donor.state,

                    "pincode":
                        donor.pincode,

                    "language":
                        donor.language_preference,

                    "status_active":
                        donor.status_active,

                    "picture":
                        (
                            request.build_absolute_uri(
                                donor.picture.url
                            )
                            if donor.picture
                            else None
                        ),
                }
            )

        except Donor.DoesNotExist:

            return Response(
                {
                    "message":
                        "Donor not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

    # =====================================================
    # NGO PROFILE
    # =====================================================

    elif user_type == "NGO":

        try:

            ngo = NGO.objects.get(
                id=user_id
            )

            return Response(
                {
                    "message":
                        "Profile API Working Successfully",

                    "user_type":
                        "NGO",

                    "id":
                        ngo.id,

                    "ngo_name":
                        ngo.ngo_name,

                    "description":
                        ngo.description,

                    "registration_no":
                        ngo.registration_no,

                    "email_id":
                        ngo.email_id,

                    "phone_no":
                        ngo.phone_no,

                    "website_link":
                        ngo.website_link,

                    "address":
                        ngo.address,

                    "city":
                        ngo.city,

                    "state":
                        ngo.state,

                    "pincode":
                        ngo.pincode,

                    "language":
                        ngo.language,

                    "status":
                        ngo.status,

                    "picture":
                        (
                            request.build_absolute_uri(
                                ngo.picture.url
                            )
                            if ngo.picture
                            else None
                        ),

                    "certificate_files":
                        (
                            request.build_absolute_uri(
                                ngo.certificate_files.url
                            )
                            if ngo.certificate_files
                            else None
                        ),
                }
            )

        except NGO.DoesNotExist:

            return Response(
                {
                    "message":
                        "NGO not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

    # =====================================================
    # INVALID USER TYPE
    # =====================================================

    return Response(
        {
            "message":
                "Invalid user type"
        },
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# PROFILE IMAGE UPLOAD API
# =========================================================

@api_view(["POST"])
@permission_classes([
    IsAuthenticated
])
def upload_profile_image(request):

    user_id = request.auth.get(
        "user_id"
    )

    user_type = request.auth.get(
        "user_type"
    )

    # -----------------------------------------------------
    # CHECK FILE
    # -----------------------------------------------------

    if "picture" not in request.FILES:

        return Response(
            {
                "message":
                    "Please select an image."
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =====================================================
    # DONOR
    # =====================================================

    if user_type == "Donor":

        try:

            donor = Donor.objects.get(
                id=user_id
            )

            donor.picture = request.FILES[
                "picture"
            ]

            donor.save()

            return Response(
                {
                    "message":
                        "Profile image uploaded successfully",

                    "image":
                        donor.picture.url
                }
            )

        except Donor.DoesNotExist:

            return Response(
                {
                    "message":
                        "Donor not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

    # =====================================================
    # NGO
    # =====================================================

    elif user_type == "NGO":

        try:

            ngo = NGO.objects.get(
                id=user_id
            )

            ngo.picture = request.FILES[
                "picture"
            ]

            ngo.save()

            return Response(
                {
                    "message":
                        "Profile image uploaded successfully",

                    "image":
                        ngo.picture.url
                }
            )

        except NGO.DoesNotExist:

            return Response(
                {
                    "message":
                        "NGO not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

    # =====================================================
    # INVALID USER TYPE
    # =====================================================

    return Response(
        {
            "message":
                "Invalid user type"
        },
        status=status.HTTP_400_BAD_REQUEST
    )


# =========================================================
# NGO CERTIFICATE UPLOAD API
# =========================================================

@api_view(["POST"])
@permission_classes([
    IsAuthenticated
])
def upload_ngo_certificate(request):

    user_id = request.auth.get(
        "user_id"
    )

    user_type = request.auth.get(
        "user_type"
    )

    # -----------------------------------------------------
    # ONLY NGO
    # -----------------------------------------------------

    if user_type != "NGO":

        return Response(
            {
                "message":
                    "Only NGOs can upload certificates."
            },
            status=status.HTTP_403_FORBIDDEN
        )

    try:

        ngo = NGO.objects.get(
            id=user_id
        )

        # -------------------------------------------------
        # CHECK CERTIFICATE
        # -------------------------------------------------

        if "certificate_files" not in request.FILES:

            return Response(
                {
                    "message":
                        "Please select a certificate file."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # SAVE CERTIFICATE
        # -------------------------------------------------

        ngo.certificate_files = request.FILES[
            "certificate_files"
        ]

        ngo.save()

        return Response(
            {
                "message":
                    "Certificate uploaded successfully",

                "certificate":
                    ngo.certificate_files.url
            }
        )

    except NGO.DoesNotExist:

        return Response(
            {
                "message":
                    "NGO not found"
            },
            status=status.HTTP_404_NOT_FOUND
        )


# =========================================================
# LOGIN API WITH JWT
# =========================================================

class LoginView(APIView):

    def get_tokens_for_user(
        self,
        user_id,
        user_type
    ):

        refresh = RefreshToken()

        refresh["user_id"] = user_id

        refresh["user_type"] = user_type

        return {
            "refresh":
                str(refresh),

            "access":
                str(
                    refresh.access_token
                )
        }

    def post(self, request):

        serializer = LoginSerializer(
            data=request.data
        )

        if not serializer.is_valid():

            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data[
            "email"
        ]

        password = serializer.validated_data[
            "password"
        ]

        # =================================================
        # DONOR LOGIN
        # =================================================

        try:

            donor = Donor.objects.get(
                email=email
            )

            if check_password(
                password,
                donor.password
            ):

                tokens = self.get_tokens_for_user(
                    donor.id,
                    "Donor"
                )

                return Response(
                    {
                        "message":
                            "Login Successful",

                        "user_type":
                            "Donor",

                        "user_id":
                            donor.id,

                        "name":
                            donor.name,

                        "email":
                            donor.email,

                        "tokens":
                            tokens
                    }
                )

        except Donor.DoesNotExist:

            pass

        # =================================================
        # NGO LOGIN
        # =================================================

        try:

            ngo = NGO.objects.get(
                email_id=email
            )

            if check_password(
                password,
                ngo.password
            ):

                tokens = self.get_tokens_for_user(
                    ngo.id,
                    "NGO"
                )

                return Response(
                    {
                        "message":
                            "Login Successful",

                        "user_type":
                            "NGO",

                        "user_id":
                            ngo.id,

                        "name":
                            ngo.ngo_name,

                        "email":
                            ngo.email_id,

                        "tokens":
                            tokens
                    }
                )

        except NGO.DoesNotExist:

            pass

        # =================================================
        # INVALID LOGIN
        # =================================================

        return Response(
            {
                "message":
                    "Invalid Email or Password"
            },
            status=status.HTTP_401_UNAUTHORIZED
        )


# =========================================================
# NGO DONATION REQUESTS
# =========================================================

class NGODonationListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_id = request.auth.get(
            "user_id"
        )

        user_type = request.auth.get(
            "user_type"
        )

        # -------------------------------------------------
        # ONLY NGO
        # -------------------------------------------------

        if user_type != "NGO":

            return Response(
                {
                    "message":
                        "Only NGOs can view donation requests."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND NGO
        # -------------------------------------------------

        try:

            ngo = NGO.objects.get(
                id=user_id
            )

        except NGO.DoesNotExist:

            return Response(
                {
                    "message":
                        "NGO not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # GET NGO DONATIONS
        # -------------------------------------------------

        donations = Donation.objects.filter(
            ngo=ngo
        ).select_related(
            "donor",
            "ngo"
        ).order_by(
            "-donation_date"
        )

        serializer = DonationSerializer(
            donations,
            many=True
        )

        return Response(
            serializer.data
        )


# =========================================================
# NGO ACCEPT / REJECT DONATION
# =========================================================

class DonationStatusUpdateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(
        self,
        request,
        pk
    ):

        user_id = request.auth.get(
            "user_id"
        )

        user_type = request.auth.get(
            "user_type"
        )

        # -------------------------------------------------
        # ONLY NGO
        # -------------------------------------------------

        if user_type != "NGO":

            return Response(
                {
                    "message":
                        "Only NGOs can update donation status."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND NGO
        # -------------------------------------------------

        try:

            ngo = NGO.objects.get(
                id=user_id
            )

        except NGO.DoesNotExist:

            return Response(
                {
                    "message":
                        "NGO not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # FIND DONATION
        # -------------------------------------------------

        try:

            donation = Donation.objects.get(
                id=pk
            )

        except Donation.DoesNotExist:

            return Response(
                {
                    "message":
                        "Donation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # NGO CAN UPDATE ONLY ITS OWN DONATION
        # -------------------------------------------------

        if donation.ngo_id != ngo.id:

            return Response(
                {
                    "message":
                        "You are not authorized to update this donation."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # GET NEW STATUS
        # -------------------------------------------------

        new_status = request.data.get(
            "status"
        )

        # -------------------------------------------------
        # VALID STATUSES
        # -------------------------------------------------

        if new_status not in [
            "Accepted",
            "Rejected",
            "Collected"
        ]:

            return Response(
                {
                    "message":
                        "Invalid donation status."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # UPDATE
        # -------------------------------------------------

        donation.status = new_status

        donation.save()

        return Response(
            {
                "message":
                    f"Donation {new_status.lower()} successfully.",

                "donation_id":
                    donation.id,

                "status":
                    donation.status
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# DONOR MY DONATIONS
# =========================================================

class DonorDonationListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_id = request.auth.get(
            "user_id"
        )

        user_type = request.auth.get(
            "user_type"
        )

        # -------------------------------------------------
        # ONLY DONORS
        # -------------------------------------------------

        if user_type != "Donor":

            return Response(
                {
                    "message":
                        "Only donors can view their donations."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND DONOR
        # -------------------------------------------------

        try:

            donor = Donor.objects.get(
                id=user_id
            )

        except Donor.DoesNotExist:

            return Response(
                {
                    "message":
                        "Donor not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # GET DONATIONS
        # -------------------------------------------------

        donations = Donation.objects.filter(
            donor=donor
        ).select_related(
            "donor",
            "ngo"
        ).order_by(
            "-donation_date"
        )

        serializer = DonationSerializer(
            donations,
            many=True
        )

        return Response(
            serializer.data
        )


# =========================================================
# NGO REQUIREMENT API
# =========================================================

class NGORequirementListCreateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    # -----------------------------------------------------
    # GET NGO REQUIREMENTS
    # -----------------------------------------------------

    def get(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can view requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            ngo = NGO.objects.get(id=user_id)
        except NGO.DoesNotExist:
            return Response(
                {
                    "message": "NGO not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        requirements = NGORequirement.objects.filter(
            ngo=ngo
        ).order_by("-created_at")

        serializer = NGORequirementSerializer(
            requirements,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -----------------------------------------------------
    # CREATE REQUIREMENT
    # -----------------------------------------------------

    def post(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can create requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            ngo = NGO.objects.get(id=user_id)
        except NGO.DoesNotExist:
            return Response(
                {
                    "message": "NGO not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if ngo.status != "Approved":
            return Response(
                {
                    "message":
                        "Only approved NGOs can create requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        data = request.data.copy()
        data.pop("ngo", None)

        serializer = NGORequirementSerializer(
            data=data
        )

        if serializer.is_valid():
            requirement = serializer.save(
                ngo=ngo
            )

            return Response(
                NGORequirementSerializer(
                    requirement
                ).data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# NGO REQUIREMENT DETAIL API
# =========================================================

class NGORequirementDetailView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    # -----------------------------------------------------
    # GET
    # -----------------------------------------------------

    def get(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can view requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            requirement = NGORequirement.objects.get(
                id=pk,
                ngo_id=user_id
            )
        except NGORequirement.DoesNotExist:
            return Response(
                {
                    "message":
                        "Requirement not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = NGORequirementSerializer(
            requirement
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    # -----------------------------------------------------
    # UPDATE
    # -----------------------------------------------------

    def put(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can update requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            requirement = NGORequirement.objects.get(
                id=pk,
                ngo_id=user_id
            )
        except NGORequirement.DoesNotExist:
            return Response(
                {
                    "message":
                        "Requirement not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = NGORequirementSerializer(
            requirement,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # -----------------------------------------------------
    # DELETE
    # -----------------------------------------------------

    def delete(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can delete requirements."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            requirement = NGORequirement.objects.get(
                id=pk,
                ngo_id=user_id
            )
        except NGORequirement.DoesNotExist:
            return Response(
                {
                    "message":
                        "Requirement not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        requirement.delete()

        return Response(
            {
                "message":
                    "Requirement deleted successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# ITEM / PRIORITY MATCHING HELPERS
# =========================================================

def normalize_item_name(name):
    """
    Normalize item names so singular/plural variants match.

    Examples:
        Book  -> book
        Books -> book
        Rice  -> rice
        rice  -> rice
    """
    name = str(name or "").strip().lower()
    name = " ".join(name.replace("-", " ").split())

    if name.endswith("ies") and len(name) > 3:
        return name[:-3] + "y"

    # Do not remove the final "s" from words such as:
    # glass, class, bus, etc.
    if (
        name.endswith("s")
        and not name.endswith(("ss", "us", "is"))
        and len(name) > 3
    ):
        return name[:-1]

    return name


def item_names_match(donation_name, requirement_name):
    """Allow a donation containing several AI-detected items to match."""
    donation_items = [
        normalize_item_name(item)
        for item in str(donation_name or "").split(",")
    ]
    requirement_item = normalize_item_name(requirement_name)

    return requirement_item in donation_items


def normalize_category(category):
    """Normalize common category labels returned by image analysis."""
    value = str(category or "").strip().lower()

    aliases = {
        "clothes": "clothing",
        "cloth": "clothing",
        "apparel": "clothing",
        "stationery": "school supplies",
        "school": "school supplies",
        "education": "school supplies",
        "medical": "medical supplies",
        "electronic": "electronics",
    }

    return aliases.get(value, value)


def categories_match(
    donation_category,
    requirement_category,
    donation_name=""
):
    normalized_donation = normalize_category(donation_category)
    normalized_requirement = normalize_category(requirement_category)

    # The frontend stores mixed AI categories as Other. The item-name
    # check still limits this fallback to an actual detected item.
    if normalized_donation == "other" and "," in str(donation_name):
        return True

    return normalized_donation == normalized_requirement


# User-requested AI priority order:
# High > Medium > Low
#
# Urgent is kept as a valid database value, but because the
# requested order explicitly starts with High, it is placed
# after Low unless the requirement is changed later.
AI_PRIORITY_SCORES = {
    "high": 100,
    "medium": 80,
    "low": 60,
    "urgent": 40,
}


# =========================================================
# MATCHING NGO API
# =========================================================

class MatchingNGOView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "Donor":
            return Response(
                {
                    "message":
                        "Only donors can find matching NGOs."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            donation = Donation.objects.get(
                id=pk,
                donor_id=user_id
            )
        except Donation.DoesNotExist:
            return Response(
                {
                    "message":
                        "Donation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # CATEGORY + ACTIVE + APPROVED NGO
        # -------------------------------------------------

        requirements = (
            NGORequirement.objects
            .filter(
                is_active=True,
                ngo__status="Approved"
            )
            .select_related("ngo")
        )

        matches = []

        for requirement in requirements:

            # Book == Books after normalization
            if not item_names_match(
                donation.item_name,
                requirement.item_name
            ):
                continue

            if not categories_match(
                donation.category,
                requirement.category,
                donation.item_name
            ):
                continue

            remaining_need = (
                requirement.required_quantity
                - requirement.fulfilled_quantity
            )

            if remaining_need <= 0:
                continue

            matches.append(
                {
                    "requirement_id":
                        requirement.id,

                    "ngo_id":
                        requirement.ngo.id,

                    "ngo_name":
                        requirement.ngo.ngo_name,

                    "city":
                        requirement.ngo.city,

                    "state":
                        requirement.ngo.state,

                    "item_name":
                        requirement.item_name,

                    "category":
                        requirement.category,

                    "required_quantity":
                        requirement.required_quantity,

                    "fulfilled_quantity":
                        requirement.fulfilled_quantity,

                    "remaining_need":
                        remaining_need,

                    "can_receive":
                        min(
                            donation.quantity,
                            remaining_need
                        ),

                    "priority":
                        requirement.priority,
                }
            )

        # High > Medium > Low > Urgent
        matches.sort(
            key=lambda x: (
                AI_PRIORITY_SCORES.get(
                    str(x["priority"]).strip().lower(),
                    0
                ),
                x["remaining_need"]
            ),
            reverse=True
        )

        return Response(
            {
                "donation_id":
                    donation.id,

                "item_name":
                    donation.item_name,

                "category":
                    donation.category,

                "donation_quantity":
                    donation.quantity,

                "matching_ngos":
                    matches
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# AI MATCHING NGO API
# =========================================================

class AIMatchView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        # -------------------------------------------------
        # ONLY DONORS
        # -------------------------------------------------

        if user_type != "Donor":
            return Response(
                {
                    "message":
                        "Only donors can use AI matching."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND DONATION
        # -------------------------------------------------

        try:
            donation = Donation.objects.get(
                id=pk,
                donor_id=user_id
            )
        except Donation.DoesNotExist:
            return Response(
                {
                    "message":
                        "Donation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # FIND ACTIVE NGO REQUIREMENTS
        # -------------------------------------------------

        requirements = (
            NGORequirement.objects
            .filter(
                is_active=True,
                ngo__status="Approved"
            )
            .select_related("ngo")
        )

        matches = []

        # -------------------------------------------------
        # CHECK NGO REQUIREMENTS
        # -------------------------------------------------

        for requirement in requirements:

            # Book == Books
            if not item_names_match(
                donation.item_name,
                requirement.item_name
            ):
                continue

            if not categories_match(
                donation.category,
                requirement.category,
                donation.item_name
            ):
                continue

            remaining_need = (
                requirement.required_quantity
                - requirement.fulfilled_quantity
            )

            if remaining_need <= 0:
                continue

            recommended_quantity = min(
                donation.quantity,
                remaining_need
            )

            priority = str(
                requirement.priority
            ).strip().lower()

            priority_score = AI_PRIORITY_SCORES.get(
                priority,
                0
            )

            # -------------------------------------------------
            # QUANTITY COMPATIBILITY
            # -------------------------------------------------

            if donation.quantity == remaining_need:
                quantity_score = 30
            elif donation.quantity < remaining_need:
                quantity_score = 20
            else:
                quantity_score = 15

            # Priority is intentionally weighted much more
            # strongly than quantity.
            ai_score = (
                priority_score * 100
                + quantity_score
            )

            # -------------------------------------------------
            # AI REASON
            # -------------------------------------------------

            if priority == "high":

                reason = (
                    f"{requirement.ngo.ngo_name} has a "
                    f"HIGH priority requirement for "
                    f"{requirement.item_name}. "
                    f"The NGO currently needs "
                    f"{remaining_need} units."
                )

            elif priority == "medium":

                reason = (
                    f"{requirement.ngo.ngo_name} has a "
                    f"MEDIUM priority requirement for "
                    f"{requirement.item_name}. "
                    f"The NGO currently needs "
                    f"{remaining_need} units."
                )

            elif priority == "low":

                reason = (
                    f"{requirement.ngo.ngo_name} has a "
                    f"LOW priority requirement for "
                    f"{requirement.item_name}. "
                    f"The NGO currently needs "
                    f"{remaining_need} units."
                )

            elif priority == "urgent":

                reason = (
                    f"{requirement.ngo.ngo_name} has an "
                    f"URGENT requirement for "
                    f"{requirement.item_name}. "
                    f"The NGO currently needs "
                    f"{remaining_need} units."
                )

            elif donation.quantity == remaining_need:

                reason = (
                    f"Your donation exactly matches the "
                    f"remaining requirement of "
                    f"{requirement.ngo.ngo_name}."
                )

            else:

                reason = (
                    f"{requirement.ngo.ngo_name} needs "
                    f"{remaining_need} units of "
                    f"{requirement.item_name}."
                )

            matches.append(
                {
                    "requirement_id":
                        requirement.id,

                    "ngo_id":
                        requirement.ngo.id,

                    "ngo_name":
                        requirement.ngo.ngo_name,

                    "city":
                        requirement.ngo.city,

                    "state":
                        requirement.ngo.state,

                    "item_name":
                        requirement.item_name,

                    "category":
                        requirement.category,

                    "required_quantity":
                        requirement.required_quantity,

                    "fulfilled_quantity":
                        requirement.fulfilled_quantity,

                    "remaining_need":
                        remaining_need,

                    "donation_quantity":
                        donation.quantity,

                    "recommended_quantity":
                        recommended_quantity,

                    "priority":
                        requirement.priority,

                    "priority_score":
                        priority_score,

                    "ai_score":
                        ai_score,

                    "ai_reason":
                        reason,
                }
            )

        # -------------------------------------------------
        # NO MATCH FOUND
        # -------------------------------------------------

        if not matches:

            return Response(
                {
                    "success": True,

                    "donation_id":
                        donation.id,

                    "item_name":
                        donation.item_name,

                    "category":
                        donation.category,

                    "donation_quantity":
                        donation.quantity,

                    "ai_recommendation":
                        None,

                    "other_matching_ngos":
                        [],

                    "message":
                        "No approved NGO currently needs this item."
                },
                status=status.HTTP_200_OK
            )

        # -------------------------------------------------
        # SORT
        # -------------------------------------------------
        # IMPORTANT:
        # Priority is the FIRST sorting factor.
        #
        # High   -> first
        # Medium -> second
        # Low    -> third
        # Urgent -> fourth (as requested)
        #
        # Quantity compatibility is only used after priority.
        # -------------------------------------------------

        matches.sort(
            key=lambda x: (
                x["priority_score"],
                x["ai_score"],
                x["remaining_need"]
            ),
            reverse=True
        )

        best_match = matches[0]

        # -------------------------------------------------
        # RESPONSE
        # -------------------------------------------------

        return Response(
            {
                "success": True,

                "donation_id":
                    donation.id,

                "item_name":
                    donation.item_name,

                "category":
                    donation.category,

                "donation_quantity":
                    donation.quantity,

                "ai_recommendation":
                    best_match,

                "other_matching_ngos":
                    matches[1:],

                "message":
                    (
                        f"AI recommends "
                        f"{best_match['ngo_name']} "
                        f"because it has the highest "
                        f"priority among matching requirements."
                    )
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# DONATION ALLOCATION API
# =========================================================

class DonationAllocationView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "Donor":
            return Response(
                {
                    "message":
                        "Only donors can allocate donations."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            donation = Donation.objects.get(
                id=pk,
                donor_id=user_id
            )
        except Donation.DoesNotExist:
            return Response(
                {
                    "message":
                        "Donation not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        allocations = request.data.get(
            "allocations"
        )

        if not isinstance(
            allocations,
            list
        ) or not allocations:

            return Response(
                {
                    "message":
                        "allocations must be a non-empty list."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            requested_total = sum(
                int(item.get("quantity", 0))
                for item in allocations
            )
        except (TypeError, ValueError):

            return Response(
                {
                    "message":
                        "Quantity must be a valid number."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if requested_total <= 0:
            return Response(
                {
                    "message":
                        "Allocation quantity must be greater than 0."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if requested_total > donation.quantity:
            return Response(
                {
                    "message":
                        "Allocated quantity cannot exceed donated quantity."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        created_allocations = []

        # -------------------------------------------------
        # Validate and create each allocation.
        # -------------------------------------------------

        for item in allocations:

            requirement_id = item.get(
                "requirement_id"
            )

            try:
                quantity = int(
                    item.get(
                        "quantity",
                        0
                    )
                )
            except (TypeError, ValueError):

                return Response(
                    {
                        "message":
                            "Invalid allocation quantity."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if quantity <= 0:
                return Response(
                    {
                        "message":
                            "Allocation quantity must be greater than 0."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                requirement = (
                    NGORequirement.objects
                    .select_related("ngo")
                    .get(
                        id=requirement_id,
                        is_active=True,
                        ngo__status="Approved"
                    )
                )
            except NGORequirement.DoesNotExist:

                return Response(
                    {
                        "message":
                            "NGO requirement not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            # -------------------------------------------------
            # NORMALIZED ITEM + CATEGORY MATCHING
            # -------------------------------------------------

            if (
                not item_names_match(
                    donation.item_name,
                    requirement.item_name
                )
                or
                not categories_match(
                    requirement.category,
                    donation.category,
                    donation.item_name
                )
            ):

                return Response(
                    {
                        "message":
                            f"{requirement.ngo.ngo_name} "
                            "does not require this item."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            remaining_need = (
                requirement.required_quantity
                - requirement.fulfilled_quantity
            )

            if remaining_need <= 0:
                return Response(
                    {
                        "message":
                            f"{requirement.ngo.ngo_name} "
                            "requirement is already fulfilled."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if quantity > remaining_need:
                return Response(
                    {
                        "message":
                            f"{requirement.ngo.ngo_name} needs only "
                            f"{remaining_need}."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            allocation = DonationAllocation.objects.create(
                donation=donation,
                ngo=requirement.ngo,
                requirement=requirement,
                allocated_quantity=quantity
            )

            requirement.fulfilled_quantity += quantity

            requirement.save(
                update_fields=[
                    "fulfilled_quantity",
                    "updated_at"
                ]
            )

            created_allocations.append(
                allocation
            )

        # -------------------------------------------------
        # Keep old Donation.ngo field compatible.
        # -------------------------------------------------

        if len(created_allocations) == 1:

            donation.ngo = (
                created_allocations[0].ngo
            )

            donation.save(
                update_fields=["ngo"]
            )

        serializer = DonationAllocationSerializer(
            created_allocations,
            many=True
        )

        return Response(
            {
                "message":
                    "Donation allocated successfully.",

                "donation_id":
                    donation.id,

                "donated_quantity":
                    donation.quantity,

                "allocated_quantity":
                    requested_total,

                "remaining_quantity":
                    donation.quantity - requested_total,

                "allocations":
                    serializer.data
            },
            status=status.HTTP_201_CREATED
        )


# =========================================================
# NGO ALLOCATED DONATIONS API
# =========================================================

class NGODonationAllocationListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {
                    "message":
                        "Only NGOs can view allocated donations."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            NGO.objects.get(
                id=user_id
            )
        except NGO.DoesNotExist:
            return Response(
                {
                    "message":
                        "NGO not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        allocations = (
            DonationAllocation.objects
            .filter(
                ngo_id=user_id
            )
            .select_related(
                "donation",
                "donation__donor",
                "ngo",
                "requirement"
            )
            .order_by(
                "-allocated_at"
            )
        )

        serializer = DonationAllocationSerializer(
            allocations,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# SCHEDULE PICKUP — DONOR CREATES PICKUP REQUEST
# =========================================================
#
# POST /api/pickup/
#
# Body:
#   allocation_id   int       required
#   pickup_address  string    required
#   scheduled_time  datetime  required  (ISO 8601)
#   notes           string    optional
#
# Only the donor who owns the allocation can create.
# One allocation can only have one pickup request.
# =========================================================

class PickupCreateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        # -------------------------------------------------
        # ONLY DONORS
        # -------------------------------------------------

        if user_type != "Donor":
            return Response(
                {
                    "message":
                        "Only donors can schedule a pickup."
                },
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # VALIDATE FIELDS
        # -------------------------------------------------

        allocation_id  = request.data.get("allocation_id")
        pickup_address = request.data.get("pickup_address", "").strip()
        scheduled_time = request.data.get("scheduled_time")
        notes          = request.data.get("notes", "").strip()

        if not allocation_id:
            return Response(
                {"message": "allocation_id is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not pickup_address:
            return Response(
                {"message": "pickup_address is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not scheduled_time:
            return Response(
                {"message": "scheduled_time is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # FIND ALLOCATION — must belong to this donor
        # -------------------------------------------------

        try:
            allocation = (
                DonationAllocation.objects
                .select_related(
                    "donation",
                    "donation__donor",
                    "ngo"
                )
                .get(
                    id=allocation_id,
                    donation__donor_id=user_id
                )
            )
        except DonationAllocation.DoesNotExist:
            return Response(
                {"message": "Allocation not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        # -------------------------------------------------
        # NO DUPLICATE PICKUP FOR SAME ALLOCATION
        # -------------------------------------------------

        if hasattr(allocation, "pickup_request"):
            return Response(
                {"message": "A pickup request already exists for this allocation."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # PARSE DATETIME
        # -------------------------------------------------

        from django.utils.dateparse import parse_datetime
        from django.utils import timezone as tz

        parsed_time = parse_datetime(str(scheduled_time))

        if parsed_time is None:
            return Response(
                {"message": "Invalid scheduled_time format. Use ISO 8601 (e.g. 2026-09-01T10:00:00)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make timezone-aware if naive
        if tz.is_naive(parsed_time):
            parsed_time = tz.make_aware(parsed_time)

        # Must be in the future
        if parsed_time <= tz.now():
            return Response(
                {"message": "Scheduled pickup time must be in the future."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # -------------------------------------------------
        # CREATE PICKUP REQUEST
        # -------------------------------------------------

        pickup = PickupRequest.objects.create(
            allocation=allocation,
            pickup_address=pickup_address,
            scheduled_time=parsed_time,
            notes=notes,
            status="Pending"
        )

        serializer = PickupRequestSerializer(pickup)

        return Response(
            {
                "message": "Pickup scheduled successfully.",
                "pickup": serializer.data
            },
            status=status.HTTP_201_CREATED
        )


# =========================================================
# DONOR — MY PICKUP REQUESTS
# =========================================================
#
# GET /api/pickup/my/
#
# Returns all pickup requests created by the logged-in donor,
# ordered newest first.
# =========================================================

class DonorPickupListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "Donor":
            return Response(
                {"message": "Only donors can view their pickup requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        pickups = (
            PickupRequest.objects
            .filter(
                allocation__donation__donor_id=user_id
            )
            .select_related(
                "allocation",
                "allocation__donation",
                "allocation__donation__donor",
                "allocation__ngo"
            )
            .order_by("-created_at")
        )

        serializer = PickupRequestSerializer(
            pickups,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# NGO — VIEW INCOMING PICKUP REQUESTS
# =========================================================
#
# GET  /api/pickup/ngo/         → list all pickup requests for this NGO
# POST /api/pickup/ngo/{id}/status/  → update status
#
# Status transitions allowed by NGO:
#   Pending    → Confirmed  (NGO accepts)
#   Pending    → Cancelled  (NGO rejects)
#   Confirmed  → Dispatched (NGO dispatches)
#   Dispatched → Delivered  (NGO marks delivered)
#   Any        → Cancelled  (NGO cancels)
# =========================================================

class NGOPickupListView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {"message": "Only NGOs can view pickup requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        pickups = (
            PickupRequest.objects
            .filter(
                allocation__ngo_id=user_id
            )
            .select_related(
                "allocation",
                "allocation__donation",
                "allocation__donation__donor",
                "allocation__ngo"
            )
            .order_by("-created_at")
        )

        serializer = PickupRequestSerializer(
            pickups,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# NGO — UPDATE PICKUP STATUS
# =========================================================
#
# PATCH /api/pickup/{id}/status/
#
# Body:  { "status": "Confirmed" | "Dispatched" | "Delivered" | "Cancelled" }
# =========================================================

class PickupStatusUpdateView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    # Valid NGO-initiated transitions
    VALID_TRANSITIONS = {
        "Pending":    ["Confirmed", "Cancelled"],
        "Confirmed":  ["Dispatched", "Cancelled"],
        "Dispatched": ["Delivered",  "Cancelled"],
        "Delivered":  [],
        "Cancelled":  [],
    }

    def patch(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "NGO":
            return Response(
                {"message": "Only NGOs can update pickup status."},
                status=status.HTTP_403_FORBIDDEN
            )

        # -------------------------------------------------
        # FIND PICKUP — must belong to this NGO
        # -------------------------------------------------

        try:
            pickup = (
                PickupRequest.objects
                .select_related(
                    "allocation",
                    "allocation__donation",
                    "allocation__donation__donor",
                    "allocation__ngo"
                )
                .get(
                    id=pk,
                    allocation__ngo_id=user_id
                )
            )
        except PickupRequest.DoesNotExist:
            return Response(
                {"message": "Pickup request not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status", "").strip()

        allowed = self.VALID_TRANSITIONS.get(
            pickup.status,
            []
        )

        if new_status not in allowed:
            return Response(
                {
                    "message":
                        f"Cannot transition from '{pickup.status}' to '{new_status}'. "
                        f"Allowed: {allowed or 'none (terminal state)'}."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        pickup.status = new_status
        pickup.save(update_fields=["status", "updated_at"])

        # -------------------------------------------------
        # When NGO confirms, also update DonationAllocation
        # status to "Accepted" so the donor dashboard
        # existing status fields stay consistent.
        # When delivered, mark allocation Collected.
        # -------------------------------------------------

        allocation = pickup.allocation

        if new_status == "Confirmed":
            allocation.status = "Accepted"
            allocation.save(update_fields=["status"])

        elif new_status == "Delivered":
            allocation.status = "Collected"
            allocation.save(update_fields=["status"])

        elif new_status == "Cancelled":
            allocation.status = "Rejected"
            allocation.save(update_fields=["status"])

        serializer = PickupRequestSerializer(pickup)

        return Response(
            {
                "message": f"Pickup status updated to '{new_status}'.",
                "pickup": serializer.data
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# DONOR — CANCEL PICKUP REQUEST
# =========================================================
#
# DELETE /api/pickup/{id}/cancel/
#
# Donor can cancel a Pending pickup.
# =========================================================

class DonorPickupCancelView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def patch(self, request, pk):

        user_id = request.auth.get("user_id")
        user_type = request.auth.get("user_type")

        if user_type != "Donor":
            return Response(
                {"message": "Only donors can cancel pickup requests."},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            pickup = (
                PickupRequest.objects
                .select_related("allocation")
                .get(
                    id=pk,
                    allocation__donation__donor_id=user_id
                )
            )
        except PickupRequest.DoesNotExist:
            return Response(
                {"message": "Pickup request not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        if pickup.status not in ["Pending"]:
            return Response(
                {
                    "message":
                        f"Cannot cancel a pickup that is already '{pickup.status}'."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        pickup.status = "Cancelled"
        pickup.save(update_fields=["status", "updated_at"])

        return Response(
            {"message": "Pickup request cancelled."},
            status=status.HTTP_200_OK
        )
