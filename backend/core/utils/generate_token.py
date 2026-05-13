from rest_framework_simplejwt.tokens import RefreshToken,TokenError 

from datetime import timedelta

class Token(RefreshToken):

    lifetime = timedelta(days=30)
    access_token_lifetime = timedelta(days=7)

    @classmethod
    def for_user(cls, instance):
        token = super().for_user(instance)
        if hasattr(instance,'email'):
            token['email'] = instance.email
        if hasattr(instance,'username'):
            token['username'] = instance.username
        if hasattr(instance,'role'):
            token['role'] = instance.role
        return token



