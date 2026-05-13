# import jwt
from rest_framework_simplejwt.tokens import UntypedToken,TokenError
from rest_framework_simplejwt.exceptions import InvalidToken   
from rest_framework import status
from accounts.models import User
from django.http import JsonResponse
from rest_framework.exceptions import AuthenticationFailed



EXCLUDED_PATHS = [
    #Swagger Schema
    '/api/v1/schema/',
    '/api/v1/docs/',
    '/api/v1/redoc/',

    '/media/',
    '/favicon.ico',
    '/api/v1/admin/',
    '/api/v1/accounts/auth/register',
    '/api/v1/accounts/auth/register/otp/verify',
    '/api/v1/accounts/auth/login',
    '/api/v1/accounts/auth/login/otp/verify',
    '/api/v1/accounts/auth/password/reset',
    '/api/v1/accounts/auth/password/reset/otp/verify',
    '/api/v1/accounts/auth/resend/otp',
    '/api/v1/accounts/auth/forgot-password/resend/otp',
    '/api/v1/core/refresh-token',
]


class JWTAuthenticationMiddleware:

    def __init__(self,get_response):
         self.get_response = get_response

    def send_response(self,data=None,message="",success=True,status_code=status.HTTP_200_OK,meta=None):
        response_data = {
            "statusCode":status_code,
            "success":success,
            "message":message,
            "data":data,
            "meta":meta
        }
        return JsonResponse(response_data,status=status_code)
    

    def decoded_token(self,token):
        try:
            return UntypedToken(token)
        except(InvalidToken,TokenError) as e:
            raise AuthenticationFailed(f"Authentication failed: {str(e)}")
        

    # -------------------------------ENTITY LOAD----------------------------------
    def get_entity(self,decoded,entity_type):
        email = decoded.get("email")

        if entity_type == "user":
            user = User.objects.get(email=email)

            if not user.is_active:
                raise AuthenticationFailed(f"User is not active.")
            if not user.status == "VERIFIED":
                raise AuthenticationFailed(f"User is {user.status}.")
            
            return ("authenticated_user",user)
        
        return ("authenticated_"+entity_type,None)


    
    def authenticate(self,request,entity_type):
        access_cookie = {
            "user":"access_token",
        }[entity_type]
        access_token = request.COOKIES.get(access_cookie)
        if not access_token:
            raise AuthenticationFailed(f"Authentication credentials were not provided for {entity_type}.")
        decoded = self.decoded_token(access_token)
        attr,instance = self.get_entity(decoded,entity_type)

        setattr(request,attr,instance)
    
    # Path Match
    def path_match(self,path,patterns):
        for p in patterns:
            if p.endswith("/"):
                if path.startswith(p):
                    return True 
            else:
                if path == p:
                    return True
        return False
  
    #   Main function
    def __call__(self,request):

        if request.method == "OPTIONS":
            return self.get_response(request)
        
        path = request.path

        if self.path_match(path,EXCLUDED_PATHS):
            return self.get_response(request)
        

        try:           
            self.authenticate(request,entity_type="user")
        except AuthenticationFailed as e:
            return self.send_response(message=str(e),success=False,status_code=status.HTTP_401_UNAUTHORIZED)
        response = self.get_response(request)

        return response