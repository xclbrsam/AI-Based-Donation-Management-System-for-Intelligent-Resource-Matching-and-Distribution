from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("users.urls")),
    path("api/", include("donations.urls")),
    path("api/", include("ngos.urls")),
    path("api/", include("reports.urls")),
]