from django.urls import path
from .views import *


app_name='accounts'


urlpatterns = [
    path('get-csrf-token', GetCsrfTokenView.as_view(), name='get-csrf-token'),
    path('auth/register', RegisterView.as_view(),name='auth_register'),
    path('auth/register/otp/verify', VerifyRegisterOTPView.as_view(),name='register_otp_verify'),
    path('auth/login', LoginView.as_view(),name='otp_login'),
    path('auth/login/otp/verify', VerifyLoginOTPView.as_view(),name='login_otp_verify'),
    path('auth/password/reset', PasswordResetOTPView.as_view(),name='password_reset_otp'),
    path('auth/password/reset/otp/verify', PasswordResetOTPConfirmView.as_view(),name='password_reset_otp_verify'),  
    path('auth/logout', LogoutView.as_view(),name='logout'),
    path("auth/resend/otp",ResendOtpView.as_view(),name="resend_otp"),
    path("auth/forgot-password/resend/otp",ResendForgotPasswordOtpView.as_view(),name="resend_forgot_password_otp"),
    path("auth/login/resend/otp",ResendLoginOtpView.as_view(),name="resend_login_otp"),
]