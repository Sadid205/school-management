from rest_framework import serializers

class BaseSerializer(serializers.ModelSerializer):
    def create(self,validated_data):
        request = self.context.get("request")
        validated_data["user"] = getattr(request,"authenticated_user",None)
        return super().create(validated_data)