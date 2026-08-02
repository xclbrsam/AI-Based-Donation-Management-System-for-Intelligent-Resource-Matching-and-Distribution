from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate

from .serializers import RegisterSerializer
from .models import CustomUser


# ---------------- Register ----------------

class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Registration Successful",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ---------------- Login ----------------

class LoginView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(
            username=username,
            password=password
        )

        if user is None:
            return Response(
                {"error": "Invalid Username or Password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Debug
        print("\n========== LOGIN ==========")
        print("Username :", user.username)
        print("Role     :", user.role)
        print("===========================\n")

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "role": user.role,
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )


# ---------------- Profile ----------------

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        serializer = RegisterSerializer(request.user)

        return Response(serializer.data)


# ---------------- Users List ----------------

class UsersListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        users = CustomUser.objects.all()

        serializer = RegisterSerializer(users, many=True)

        return Response(serializer.data)


# ---------------- Update User Role ----------------

class UpdateUserRoleView(APIView):

    permission_classes = [IsAuthenticated]

    def put(self, request, pk):

        try:
            user = CustomUser.objects.get(pk=pk)

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User Not Found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        role = request.data.get("role")

        if role:
            user.role = role
            user.save()

        return Response(
            {"message": "Role Updated Successfully"},
            status=status.HTTP_200_OK,
        )


# ---------------- Delete User ----------------

class DeleteUserView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        try:
            user = CustomUser.objects.get(pk=pk)

        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User Not Found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.delete()

        return Response(
            {"message": "User Deleted Successfully"},
            status=status.HTTP_200_OK,
        )