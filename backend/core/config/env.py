from dotenv import load_dotenv
import os


load_dotenv()

# Error Class
class MissingEnvVariableError(Exception):
    pass


def loadEnvVariables ():
    requiredEnvVariables = ["EMAIL_BACKEND","EMAIL_HOST","EMAIL_PORT","EMAIL_USE_TLS","EMAIL_USE_SSL","EMAIL_HOST_USER","EMAIL_HOST_PASSWORD","DEFAULT_FROM_EMAIL","SUPER_ADMIN_EMAIL","SUPER_ADMIN_PASSWORD","SUPER_ADMIN_FIRST_NAME","SUPER_ADMIN_LAST_NAME","SUPER_ADMIN_ROLE","SUPER_ADMIN_USERNAME","DEBUG","SECRET_KEY","DB_NAME","DB_USER","DB_PASSWORD","DB_HOST","DB_PORT","PORT"]


    for e in requiredEnvVariables:
        if not os.getenv(e):
            raise MissingEnvVariableError(f"Environment variable '{e}' is missing!")

    return {
        "EMAIL_BACKEND":os.getenv("EMAIL_BACKEND"),
        "EMAIL_HOST":os.getenv("EMAIL_HOST"),
        "EMAIL_PORT":os.getenv("EMAIL_PORT"),
        "EMAIL_USE_TLS":os.getenv("EMAIL_USE_TLS"),
        "EMAIL_USE_SSL":os.getenv("EMAIL_USE_SSL"),
        "EMAIL_HOST_USER":os.getenv("EMAIL_HOST_USER"),
        "EMAIL_HOST_PASSWORD":os.getenv("EMAIL_HOST_PASSWORD"),
        "DEFAULT_FROM_EMAIL":os.getenv("DEFAULT_FROM_EMAIL"),
        "SUPER_ADMIN_EMAIL":os.getenv("SUPER_ADMIN_EMAIL"),
        "SUPER_ADMIN_PASSWORD":os.getenv("SUPER_ADMIN_PASSWORD"),
        "SUPER_ADMIN_FIRST_NAME":os.getenv("SUPER_ADMIN_FIRST_NAME"),
        "SUPER_ADMIN_LAST_NAME":os.getenv("SUPER_ADMIN_LAST_NAME"),
        "SUPER_ADMIN_ROLE":os.getenv("SUPER_ADMIN_ROLE"),
        "SUPER_ADMIN_USERNAME":os.getenv("SUPER_ADMIN_USERNAME"),
        "DEBUG":os.getenv("DEBUG"),
        "SECRET_KEY":os.getenv("SECRET_KEY"),
        "DB_NAME":os.getenv("DB_NAME"),
        "DB_USER":os.getenv("DB_USER"),
        "DB_PASSWORD":os.getenv("DB_PASSWORD"),
        "DB_HOST":os.getenv("DB_HOST"),
        "DB_PORT":os.getenv("DB_PORT"),
        "PORT":os.getenv("PORT"),
    }

envVars = loadEnvVariables()