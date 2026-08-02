from django.urls import path
from .views import NGOListCreateView, NGODetailView

urlpatterns = [
    path("ngos/", NGOListCreateView.as_view(), name="ngo-list"),
    path("ngos/<int:pk>/", NGODetailView.as_view(), name="ngo-detail"),
]