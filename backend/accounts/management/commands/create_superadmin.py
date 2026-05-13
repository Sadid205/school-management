import os
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.config.env import envVars
User = get_user_model()


class Command(BaseCommand):
    help = "Create super admin from environment variables"

    def handle(self, *args, **kwargs):
        email =envVars.get("SUPER_ADMIN_EMAIL")
        password = envVars.get("SUPER_ADMIN_PASSWORD")
        username = envVars.get("SUPER_ADMIN_USERNAME")
        first_name = envVars.get("SUPER_ADMIN_FIRST_NAME")
        last_name = envVars.get("SUPER_ADMIN_LAST_NAME")

        if not email or not password:
            self.stdout.write(self.style.ERROR("Missing env variables"))
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING("Super admin already exists"))
            return

        user = User.objects.create_superuser(
            email=email,
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )


        self.stdout.write(self.style.SUCCESS(f"Super admin created: {user.email}"))