from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    ActivateUserView,
    LoginAPIView,
    LogoutAPIView,
    RegistrationAPIView,
    UserRetrieveUpdateAPIView,
)

app_name = 'accounts'

urlpatterns = [
    path('register/', RegistrationAPIView.as_view(), name='register_user'),
    path('login/', LoginAPIView.as_view(), name='login_user'),
    path('logout/', LogoutAPIView.as_view(), name="logout_user"),
    path('user/', UserRetrieveUpdateAPIView.as_view(), name='user'),
    path('activate-user-account/<uidb64>/<token>/', ActivateUserView.as_view(), name='activate_user_account'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
