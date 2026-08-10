from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    # Frontend
    path(
        "",
        include("users.urls")
    ),

    # APIs
    path(
        "api/",
        include("users.urls")
    ),
]