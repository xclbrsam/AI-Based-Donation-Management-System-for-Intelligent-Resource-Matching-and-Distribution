from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Donation
from .serializers import DonationSerializer


# ---------------- Donation List & Create ----------------

class DonationListCreateView(generics.ListCreateAPIView):
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Donation.objects.all().order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(
            donor=self.request.user,
            status="AVAILABLE"
        )


# ---------------- Donation Detail ----------------

class DonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]


# ---------------- Accept Donation ----------------

class AcceptDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(
                {"error": "Donation not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        donation.status = "ACCEPTED"
        donation.save()

        return Response(
            {"message": "Donation Accepted Successfully"},
            status=status.HTTP_200_OK,
        )


# ---------------- Complete Donation ----------------

class CompleteDonationView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        try:
            donation = Donation.objects.get(pk=pk)
        except Donation.DoesNotExist:
            return Response(
                {"error": "Donation not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        donation.status = "COMPLETED"
        donation.save()

        return Response(
            {"message": "Donation Completed Successfully"},
            status=status.HTTP_200_OK,
        )