from rest_framework import serializers, exceptions
from .models import User,VerificationCode
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from core.config.env import envVars

class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','password','phone','image','role','status','is_active']
        extra_kwargs = {'password':{'write_only':True,'required':False},'email':{'required':False},'role':{'required':False},'status':{'required':False},'is_active':{'required':False}}
    
    # def validate(self,attrs):
    #     request = self.context.get("request")
    #     user = request.authenticated_user
    #     restricted_fields = ['role','status','is_active']

    #     if user.id == self.instance.id:
    #         for field in restricted_fields:
    #             if field in attrs:
    #                 raise serializers.ValidationError({field:"You are not allowed to update this filed."})
    #     else:
    #         if user.role not in ['ADMIN','SUPER_ADMIN']:
    #             raise serializers.ValidationError("You do not have permission to update other users.")
    #         if user.role == "ADMIN" and self.instance.role in ["ADMIN","SUPER_ADMIN"]:
    #             raise serializers.ValidationError("Admin cannot update another Admin or Super Admin.")

    #         # for field in attrs.keys():
    #         #     if field not in restricted_fields:
    #         #         raise serializers.ValidationError({field:"You are not allowed to update this filed."})
    #     return attrs


    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)
    
class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['name','username','email','password','phone','image','role','status','is_active']
        extra_kwargs = {'password':{'write_only':True},'email':{'required':True},'username':{'required':True},'password':{'required':True}}

    def validate_email(self,value):
        if User.objects.filter(auths__contains=[{'provider':'email','providerId':value}]).exists():
            raise serializers.ValidationError({"email":"This email is already registered."})
        return value

    def validate_username(self,value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError({"username":"This username is already taken."})
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username','first_name', 'last_name', 'role','email','password1','password2']

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError({"password2":"Passwords do not match."})
        
        existing_user = User.objects.filter(auths__contains=[{'provider':'email','providerId':data['email']}]).first()
        if existing_user:
            if existing_user.status == User.Status.VERIFIED:
                raise serializers.ValidationError({"email":"This email is already registered and verified"})
            else:
                existing_user.delete()
        return data


    def save(self, request):
        password = self.validated_data.pop('password1')
        self.validated_data.pop('password2')

        user = User.objects.create(**self.validated_data)
        user.set_password(password)
        user.save()

        otp_obj = VerificationCode.objects.create(user=user,email=user.email)
        send_mail(
            subject="Verify your account",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user

class ResendOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self,value):
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email":"User with this email does not exist."})
        if user.status == User.Status.VERIFIED:
            raise serializers.ValidationError({"email":"User is already verified."})
        return value
    
    def save(self,request):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        otp_obj = VerificationCode.objects.create(user=user,email=user.email,type=VerificationCode.VerificationTypeChoices.ACCOUNT_VERIFICATION)
        send_mail(
            subject="Verify your account",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user


class VerifyRegisterOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            otp_obj = VerificationCode.objects.get(email=data['email'],code=data['otp'],is_used=False,type=VerificationCode.VerificationTypeChoices.ACCOUNT_VERIFICATION )
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError({"otp":'Invalid OTP'})
        if otp_obj.is_expired():
            raise serializers.ValidationError({"otp":"OTP expired"})
        data['otp_obj'] = otp_obj
        return data
    
    def save(self):
        otp_obj = self.validated_data['otp_obj']
        otp_obj.is_used = True
        otp_obj.save()
        user = otp_obj.user 
        user.is_active = True
        user.status = User.Status.VERIFIED
        user.auths.append({"provider": "email", "providerId": user.email})
        user.save()
        return user



class VerifyLoginOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        try:
            otp_obj = VerificationCode.objects.get(email=data['email'],code=data['otp'],is_used=False,type=VerificationCode.VerificationTypeChoices.LOGIN_OTP_VERIFICATION)
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError({"otp":'Invalid OTP'})
        if otp_obj.is_expired():
            raise serializers.ValidationError({"otp":"OTP expired"})
        data['otp_obj'] = otp_obj
        return data
    
    def save(self):
        otp_obj = self.validated_data['otp_obj']
        otp_obj.is_used = True
        otp_obj.save()
        user = otp_obj.user 
        return user





# Custom login
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type':'password'},write_only=True)

    def validate(self,attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(email=email,password=password)
        
        if not user:
            raise exceptions.ValidationError({"email":"Invalid email or password."})
        if not user.is_active:
            raise exceptions.ValidationError({"email":"User account is inactive."})
        if user.status != User.Status.VERIFIED:
            raise exceptions.ValidationError({"email":f"Your account is {user.status}."})
        attrs['user'] = user
        return attrs
        
    def save(self, request=None):
        user = self.validated_data["user"]
        otp_obj = VerificationCode.objects.create(user=user,email=user.email,type=VerificationCode.VerificationTypeChoices.LOGIN_OTP_VERIFICATION)
        send_mail(
            subject="Verify your otp",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user



# OTP
class PasswordResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self,value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError({"email":"User with this email does not exist."})
        return value
    
    def save(self):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        otp_obj = VerificationCode.objects.create(user=user,email=user.email,type=VerificationCode.VerificationTypeChoices.RESET_PASSWORD_OTP_VERIFICATION)
        send_mail(
            subject="Verify your otp to reset your password.",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user
    

# Resend OTP for password reset
class ResendForgotPasswordOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self,value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email":"User with this email does not exist."})
        return value
    
    def save(self,request):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        otp_obj = VerificationCode.objects.create(user=user,email=user.email,type=VerificationCode.VerificationTypeChoices.RESET_PASSWORD_OTP_VERIFICATION)
        send_mail(
            subject="Reset your account password",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user


class ResendLoginOtpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    def validate_email(self,value):
        try:
            User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email":"User with this email does not exist."})
        return value
    
    def save(self,request):
        email = self.validated_data['email']
        user = User.objects.get(email=email)

        otp_obj = VerificationCode.objects.create(user=user,email=user.email,type=VerificationCode.VerificationTypeChoices.LOGIN_OTP_VERIFICATION)
        send_mail(
            subject="Reset your login otp",

            message=f"Your OTP is {otp_obj.code}",
            from_email=envVars.get("EMAIL_HOST_USER"),
            recipient_list=[user.email],
            fail_silently=True
        )
        return user



class PasswordResetOTPConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True)

    def validate(self,attrs):
        email = attrs.get('email')
        otp = attrs.get('otp')
        try:
            otp_obj = VerificationCode.objects.get(email=email,code=otp,is_used=False,type=VerificationCode.VerificationTypeChoices.RESET_PASSWORD_OTP_VERIFICATION)
        except VerificationCode.DoesNotExist:
            raise serializers.ValidationError({"otp":"Invalid OTP!"})
        if otp_obj.is_expired():
            raise serializers.ValidationError({"otp":"OTP expired!"})
        attrs['otp_obj'] = otp_obj
        return attrs
    
    def save(self):
        otp_obj = self.validated_data['otp_obj']
        user = otp_obj.user
        user.set_password(self.validated_data['new_password'])
        user.save()
        otp_obj.is_used = True
        otp_obj.save()
        return user


# Retrieve Serializer
class UserRetrieveSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = "__all__"
        exclude = ['password']



# List Serializer
class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
        exclude = ['password']
