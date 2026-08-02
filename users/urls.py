from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    ProfileView,
    UsersListView,
    UpdateUserRoleView,
    DeleteUserView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("users/", UsersListView.as_view(), name="users"),
    path("users/update-role/<int:pk>/", UpdateUserRoleView.as_view(), name="update-role"),
    path("users/delete/<int:pk>/", DeleteUserView.as_view(), name="delete-user"),
]