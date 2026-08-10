from django.contrib.auth import authenticate
from django.shortcuts import render
from pathlib import Path

from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

from .models import (
    CustomUser,
    Profile,
    NGOProfile
)

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ProfileSerializer,
    NGOProfileSerializer
)

from ai.image_scanner import scan_image


# ============================================================
# FRONTEND PAGE VIEWS
# ============================================================

def register_page(request):
    """
    Opens the registration page.
    """
    return render(
        request,
        "register.html"
    )


def login_page(request):
    """
    Opens the common login page
    for both Donor and NGO.
    """
    return render(
        request,
        "login.html"
    )


def donor_dashboard(request):
    """
    Opens the Donor dashboard page.
    """
    return render(
        request,
        "donor_dashboard.html"
    )


def ngo_dashboard(request):
    """
    Opens the NGO dashboard page.
    """
    return render(
        request,
        "ngo_dashboard.html"
    )


# ============================================================
# REGISTRATION API
# ============================================================

class RegisterView(generics.CreateAPIView):
    """
    Common registration API.

    Handles:
    - Donor registration
    - NGO registration

    Endpoint:
        POST /api/register/
    """

    serializer_class = RegisterSerializer

    permission_classes = [
        AllowAny
    ]


# ============================================================
# LOGIN API
# ============================================================

class LoginView(APIView):
    """
    Common login API for Donor and NGO.

    Endpoint:
        POST /api/login/

    Request:

    {
        "username": "example",
        "password": "password"
    }

    Returns:

    {
        "access": "...",
        "refresh": "...",
        "user": {
            ...
        }
    }
    """

    permission_classes = [
        AllowAny
    ]

    def post(self, request):

        # ====================================================
        # GET LOGIN DATA
        # ====================================================

        username = request.data.get(
            "username"
        )

        password = request.data.get(
            "password"
        )


        # ====================================================
        # VALIDATE INPUT
        # ====================================================

        if not username or not password:

            return Response(
                {
                    "message":
                    "Username and password are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ====================================================
        # AUTHENTICATE USER
        # ====================================================

        user = authenticate(
            username=username,
            password=password
        )


        # ====================================================
        # INVALID LOGIN
        # ====================================================

        if user is None:

            return Response(
                {
                    "message":
                    "Invalid username or password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


        # ====================================================
        # CHECK USER ACTIVE STATUS
        # ====================================================

        if not user.is_active:

            return Response(
                {
                    "message":
                    "This account has been disabled."
                },
                status=status.HTTP_403_FORBIDDEN
            )


        # ====================================================
        # CREATE JWT TOKENS
        # ====================================================

        refresh = RefreshToken.for_user(
            user
        )

        access_token = refresh.access_token


        # ====================================================
        # RETURN USER + TOKENS
        # ====================================================

        return Response(
            {

                "access": str(
                    access_token
                ),

                "refresh": str(
                    refresh
                ),

                "user": UserSerializer(
                    user
                ).data

            },
            status=status.HTTP_200_OK
        )


# ============================================================
# COMMON PROFILE API
# ============================================================

class ProfileView(APIView):
    """
    Common profile API for Donor and NGO.

    JWT determines the logged-in user.

    GET:
        /api/profile/

    PUT:
        /api/profile/
    """

    permission_classes = [
        IsAuthenticated
    ]


    # ========================================================
    # GET PROFILE
    # ========================================================

    def get(self, request):

        user = request.user


        # ====================================================
        # DONOR PROFILE
        # ====================================================

        if user.role == "Donor":

            profile, created = (
                Profile.objects.get_or_create(
                    user=user
                )
            )

            serializer = ProfileSerializer(
                profile
            )

            return Response(
                {
                    "user_type": "Donor",

                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "name": (
                            f"{user.first_name} "
                            f"{user.last_name}"
                        ).strip(),
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role
                    },

                    "profile": serializer.data
                },
                status=status.HTTP_200_OK
            )


        # ====================================================
        # NGO PROFILE
        # ====================================================

        elif user.role == "NGO":

            profile, created = (
                NGOProfile.objects.get_or_create(
                    user=user
                )
            )

            serializer = NGOProfileSerializer(
                profile
            )

            display_name = (
                profile.ngo_name
                if profile.ngo_name
                else (
                    f"{user.first_name} "
                    f"{user.last_name}"
                ).strip()
            )

            return Response(
                {
                    "user_type": "NGO",

                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "name": (
                            display_name
                            if display_name
                            else user.username
                        ),
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role
                    },

                    "profile": serializer.data
                },
                status=status.HTTP_200_OK
            )


        # ====================================================
        # INVALID ROLE
        # ====================================================

        return Response(
            {
                "message":
                "Invalid user role."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


    # ========================================================
    # UPDATE PROFILE
    # ========================================================

    def put(self, request):

        user = request.user


        # ====================================================
        # GET NAME FIELDS
        # ====================================================

        first_name = request.data.get(
            "first_name"
        )

        last_name = request.data.get(
            "last_name"
        )


        # ====================================================
        # UPDATE USER NAME
        # ====================================================

        if first_name is not None:

            user.first_name = str(
                first_name
            ).strip()


        if last_name is not None:

            user.last_name = str(
                last_name
            ).strip()


        # Save user information

        user.save()


        # ====================================================
        # DONOR PROFILE
        # ====================================================

        if user.role == "Donor":

            profile, created = (
                Profile.objects.get_or_create(
                    user=user
                )
            )


            # ------------------------------------------------
            # Profile serializer
            # ------------------------------------------------

            serializer = ProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )


            if serializer.is_valid():

                serializer.save()

            else:

                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # Updated display name
            # ------------------------------------------------

            display_name = (
                f"{user.first_name} "
                f"{user.last_name}"
            ).strip()


            if not display_name:

                display_name = user.username


            return Response(
                {

                    "message":
                    "Profile updated successfully.",

                    "user_type":
                    "Donor",

                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "name": display_name,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role
                    },

                    "profile":
                    serializer.data

                },
                status=status.HTTP_200_OK
            )


        # ====================================================
        # NGO PROFILE
        # ====================================================

        elif user.role == "NGO":

            profile, created = (
                NGOProfile.objects.get_or_create(
                    user=user
                )
            )


            # ------------------------------------------------
            # NGO profile serializer
            # ------------------------------------------------

            serializer = NGOProfileSerializer(
                profile,
                data=request.data,
                partial=True
            )


            if serializer.is_valid():

                serializer.save()

            else:

                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )


            # ------------------------------------------------
            # NGO display name
            # ------------------------------------------------

            if profile.ngo_name:

                display_name = profile.ngo_name

            else:

                display_name = (
                    f"{user.first_name} "
                    f"{user.last_name}"
                ).strip()


            if not display_name:

                display_name = user.username


            return Response(
                {

                    "message":
                    "Profile updated successfully.",

                    "user_type":
                    "NGO",

                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "name": display_name,
                        "ngo_name": profile.ngo_name,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role
                    },

                    "profile":
                    serializer.data

                },
                status=status.HTTP_200_OK
            )


        # ====================================================
        # INVALID ROLE
        # ====================================================

        return Response(
            {
                "message":
                "Invalid user role."
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# AI IMAGE SCAN
# ============================================================

class AIScanView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    parser_classes = [
        MultiPartParser,
        FormParser
    ]


    def post(self, request):

        # ====================================================
        # GET IMAGE
        # ====================================================

        image = request.FILES.get(
            "image"
        )


        if not image:

            return Response(
                {
                    "success": False,

                    "error":
                    "Image is required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ====================================================
        # IMAGE TYPE VALIDATION
        # ====================================================

        allowed_types = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ]


        if image.content_type not in allowed_types:

            return Response(
                {
                    "success": False,

                    "error":
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ====================================================
        # IMAGE SIZE VALIDATION
        # ====================================================

        max_size = 5 * 1024 * 1024


        if image.size > max_size:

            return Response(
                {
                    "success": False,

                    "error":
                    "Image size must be less than 5 MB."
                },
                status=status.HTTP_400_BAD_REQUEST
            )


        # ====================================================
        # TEMP FILE
        # ====================================================

        import tempfile

        temp_path = None


        try:

            # ------------------------------------------------
            # Get file extension
            # ------------------------------------------------

            suffix = Path(
                image.name
            ).suffix


            # ------------------------------------------------
            # Create temporary file
            # ------------------------------------------------

            with tempfile.NamedTemporaryFile(
                suffix=suffix,
                delete=False
            ) as temp_file:

                for chunk in image.chunks():

                    temp_file.write(
                        chunk
                    )


                temp_path = temp_file.name


            # =================================================
            # RUN AI MODEL
            # =================================================

            result = scan_image(
                temp_path
            )


            # =================================================
            # RETURN AI RESULT
            # =================================================

            return Response(
                result,
                status=status.HTTP_200_OK
            )


        except Exception as e:

            print(
                "AI SCANNING ERROR:",
                str(e)
            )


            return Response(
                {
                    "success": False,

                    "error":
                    "AI image scanning failed.",

                    "details":
                    str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


        finally:

            # =================================================
            # DELETE TEMP FILE
            # =================================================

            if temp_path:

                try:

                    Path(
                        temp_path
                    ).unlink(
                        missing_ok=True
                    )

                except Exception as cleanup_error:

                    print(
                        "Temporary file cleanup error:",
                        str(cleanup_error)
                    )