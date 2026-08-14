from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed

from .models import Donor, NGO


class CustomJWTAuthentication(JWTAuthentication):

    def get_user(self, validated_token):

        user_id = validated_token.get("user_id")

        if user_id is None:
            raise AuthenticationFailed("Token contains no user_id")

        # Check Donor
        try:
            return Donor.objects.get(id=user_id)
        except Donor.DoesNotExist:
            pass

        # Check NGO
        try:
            return NGO.objects.get(id=user_id)
        except NGO.DoesNotExist:
            pass

        raise AuthenticationFailed("User not found")