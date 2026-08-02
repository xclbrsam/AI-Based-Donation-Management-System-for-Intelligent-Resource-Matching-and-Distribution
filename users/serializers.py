from rest_framework import serializers
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser

        fields = [
            "id",
            "username",
            "password",
            "email",
            "name",
            "phone",
            "language_preference",
            "address",
            "city",
            "state",
            "pincode",
            "role",
            "is_active",
            "registered_at",
        ]

        read_only_fields = [
            "id",
            "is_active",
            "registered_at",
        ]

        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()

        return user