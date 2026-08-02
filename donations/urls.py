from django.urls import path
from .views import (
    DonationListCreateView,
    DonationDetailView,
    AcceptDonationView,
      CompleteDonationView,
)

urlpatterns = [
    path("donations/", DonationListCreateView.as_view(), name="donations"),
    path("donations/<int:pk>/", DonationDetailView.as_view(), name="donation-detail"),
    path("donations/accept/<int:pk>/", AcceptDonationView.as_view(), name="accept-donation"),
    path("donations/", DonationListCreateView.as_view()),
    path("donations/<int:pk>/", DonationDetailView.as_view()),
    path("donations/<int:pk>/accept/", AcceptDonationView.as_view()),
    path("donations/<int:pk>/complete/", CompleteDonationView.as_view()),
]