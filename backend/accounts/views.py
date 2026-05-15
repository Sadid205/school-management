from .models import User,VerificationCode
from core.views import BaseView
from .serializers import *
from rest_framework.parsers import MultiPartParser,FormParser
from core.permissions import RolePermission
from drf_spectacular.utils import extend_schema
from core.utils.generate_token import Token
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

#csrf token
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

# class GetCsrfTokenView(APIView):
#     permission_classes = [AllowAny]
    
#     def get(self, request):
#         csrf_token = get_token(request)
        
#         response = JsonResponse({
#             'csrfToken': csrf_token,
#             'message': 'CSRF token generated successfully'
#         })
        
#         response.set_cookie(
#             'csrftoken',
#             csrf_token,
#             httponly=False,
#             samesite='Lax',
#             secure=False, 
#         )
        
#         return response


class UserView(BaseView):
    model = User
    create_serializer = UserCreateSerializer
    list_serializer = UserListSerializer
    update_serializer = UserUpdateSerializer
    retrieve_serializer = UserRetrieveSerializer

    parser_classes = [MultiPartParser,FormParser]

    def get_permissions(self):
        if self.request.method in ['POST']:
            return [RolePermission(allowed_roles=["ADMIN", "SUPER_ADMIN"])]
        return [RolePermission()]
    
    @extend_schema(exclude=True)
    def post(self, request, *args, **kwargs):
        return super().post(request,*args,**kwargs)
    
    @extend_schema(request=UserUpdateSerializer)
    def put(self, request, *args, **kwargs):
        return super().put(request,*args,**kwargs)
    
    @extend_schema(request=UserUpdateSerializer)
    def patch(self, request, *args, **kwargs):
        return super().put(request,*args,**kwargs)
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return super().delete(request,*args,**kwargs)
    
    def get(self, request, pk=None):
        return super().get(request, pk)        


# VerifyOTPView

class VerifyRegisterOTPView(BaseView):
    model = VerificationCode

    create_serializer = VerifyRegisterOTPSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=VerifyRegisterOTPSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP verified successfully.")
    

class RegisterView(BaseView):
    model = VerificationCode

    create_serializer = RegisterSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=RegisterSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request=request)
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP sent successfully.")


class ResendOtpView(BaseView):
    model = VerificationCode

    create_serializer = ResendOtpSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=ResendOtpSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request=request)
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP sent successfully.")

class ResendForgotPasswordOtpView(BaseView):
    model = VerificationCode

    create_serializer = ResendForgotPasswordOtpSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=ResendForgotPasswordOtpSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request=request)
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP sent successfully.")
    


class ResendLoginOtpView(BaseView):
    model = VerificationCode

    create_serializer = ResendLoginOtpSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=ResendLoginOtpSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request=request)
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP sent successfully.")
    


class LoginView(BaseView):
    model = VerificationCode

    create_serializer = LoginSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=LoginSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request=request)
        return self.send_response(data={"username":user.username,"email":user.email},message="OTP sent successfully.")
    


from core.config.env import envVars
DEBUG = envVars.get("DEBUG",False)
class VerifyLoginOTPView(BaseView):
    model = VerificationCode

    create_serializer = VerifyLoginOTPSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=VerifyLoginOTPSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # JWT generate
        refresh = Token.for_user(instance=user)

        response = self.send_response(message="Logged in successfully",status_code=200)

        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            httponly=True,
            secure=False if DEBUG else True,
            samesite= 'Lax' if DEBUG else 'None',
            max_age= 60*60*24*7
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            httponly=True,
            secure=False if DEBUG else True,
            samesite= 'Lax' if DEBUG else 'None',
            max_age=30*24*60*60
        )

        return response    


class LogoutView(APIView):
    def post(self,request):
        response = Response({"success":True,"status":200,"message":"Logged out successfully"},status=status.HTTP_200_OK)

        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response


# OTP Reset
class PasswordResetOTPView(BaseView):
    model = VerificationCode

    create_serializer = PasswordResetOTPSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=PasswordResetOTPSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return self.send_response(message="OTP sent successfully.")
    

#OTP Confirm
class PasswordResetOTPConfirmView(BaseView):
    model = VerificationCode

    create_serializer = PasswordResetOTPConfirmSerializer

    @extend_schema(exclude=True)
    def get(self,request,*args,**kwargs):
        return self.method_not_allowed_response

    @extend_schema(exclude=True)
    def put(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def patch(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    @extend_schema(exclude=True)
    def delete(self, request, *args, **kwargs):
        return self.method_not_allowed_response
    
    # for swagger 
    @extend_schema(request=PasswordResetOTPConfirmSerializer)
    def post(self,request):
        serializer=self.get_serializer('create_serializer',data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return self.send_response(message="Password reset successful.")
    



# Address