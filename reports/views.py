from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from donations.models import Donation
from users.models import CustomUser


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {
            "total_donations": Donation.objects.count(),
            "available": Donation.objects.filter(status="AVAILABLE").count(),
            "accepted": Donation.objects.filter(status="ACCEPTED").count(),
            "completed": Donation.objects.filter(status="COMPLETED").count(),
            "total_donors": CustomUser.objects.filter(role="DONOR").count(),
            "total_ngos": CustomUser.objects.filter(role="NGO").count(),
        }

        return Response(data)