from django.urls import path

from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    register_page,
    login_page,
    donor_dashboard,
    AIScanView,
    ngo_dashboard
)


urlpatterns = [

    # Frontend pages

    path(
        "",
        register_page,
        name="register-page"
    ),

    path(
        "login-page/",
        login_page,
        name="login-page"
    ),

    path(
        "donor-dashboard/",
        donor_dashboard,
        name="donor-dashboard"
    ),

    path(
        "ngo-dashboard/",
        ngo_dashboard,
        name="ngo-dashboard"
    ),


    # APIs

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    # SINGLE LOGIN API
    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    # AI Scan API
    path(
       "donations/scan/",
        AIScanView.as_view(),
         name="ai-scan"
    ),
]