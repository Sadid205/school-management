# apps/accounts/models.py
from datetime import timedelta
import random

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone
from core.models import BaseModel
import uuid


class UserManager(BaseUserManager):
    """Custom manager for User model with email as unique identifier."""
    
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('status', User.Status.VERIFIED)
        extra_fields.setdefault('role', User.Role.SUPER_ADMIN)


        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True')
        
        return self.create_user(email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    """
    Custom User model with role-based access control.
    Supports: Student, Teacher, Parent, Admin
    """
    
    class Role(models.TextChoices):
        STUDENT = 'student', 'Student'
        TEACHER = 'teacher', 'Teacher'
        PARENT = 'parent', 'Parent'
        ADMIN = 'admin', 'Admin'
        SUPER_ADMIN = 'super_admin', 'Super Admin'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending Verification'
        VERIFIED = 'VERIFIED', 'Verified'
        SUSPENDED = 'SUSPENDED', 'Suspended'
    
    # Authentication Fields
    username = models.CharField(
        max_length=150,
        unique=True,
        db_index=True,
        help_text="Unique username for login"
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text="Email address used for authentication"
    )
    password = models.CharField(
        max_length=128,
        help_text="Hashed password"
    )
    
    # Profile Fields
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        help_text="Contact phone number"
    )
    
    # Role & Status
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        db_index=True,
        help_text="User role determines permissions"
    )
    status = models.CharField(
        max_length=20,
        default='PENDING',
        choices=Status.choices,
        db_index=True,
        help_text="Account status (e.g., PENDING, VERIFIED, SUSPENDED)"
    )
    is_active = models.BooleanField(
        default=True,
        db_index=True,
        help_text="Designates whether this user account is active"
    )
    is_staff = models.BooleanField(
        default=False,
        help_text="Designates whether the user can log into admin site"
    )

    auths = models.JSONField(default=list)    
    
    # Authentication settings
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'role']
    
    objects = UserManager()

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        indexes = [
            models.Index(fields=['email', 'role']),
            models.Index(fields=['username', 'role']),
            models.Index(fields=['is_active', 'role']),
        ]

    def __str__(self):
        return f"{self.get_full_name()} ({self.role})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def is_student(self):
        return self.role == self.Role.STUDENT

    @property
    def is_teacher(self):
        return self.role == self.Role.TEACHER

    @property
    def is_parent(self):
        return self.role == self.Role.PARENT

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN


class StudentProfile(BaseModel):
    """
    Extended profile for Student users.
    One-to-One relationship with User model.
    """
    
    class ClassLevel(models.IntegerChoices):
        SIX = 6, 'Class 6'
        SEVEN = 7, 'Class 7'
        EIGHT = 8, 'Class 8'
        NINE = 9, 'Class 9'
        TEN = 10, 'Class 10'
    
    class Section(models.TextChoices):
        A = 'A', 'Section A'
        B = 'B', 'Section B'
        C = 'C', 'Section C'
    
    class Group(models.TextChoices):
        SCIENCE = 'Science', 'Science'
        HUMANITIES = 'Humanities', 'Humanities'
        BUSINESS = 'Business', 'Business Studies'
    
    # Core Relationship
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile',
        help_text="Associated user account"
    )
    
    # Academic Information
    roll_number = models.CharField(
        max_length=20,
        db_index=True,
        help_text="Student roll number"
    )
    class_level = models.IntegerField(
        choices=ClassLevel.choices,
        db_index=True,
        help_text="Current class level (6-10)"
    )
    section = models.CharField(
        max_length=1,
        choices=Section.choices,
        help_text="Section (A/B/C)"
    )
    group = models.CharField(
        max_length=20,
        choices=Group.choices,
        blank=True,
        null=True,
        help_text="Group (required for Class 9-10, null for 6-8)"
    )
    
    # Personal Information
    father_name = models.CharField(max_length=200)
    mother_name = models.CharField(max_length=200)
    date_of_birth = models.DateField(
        blank=True,
        null=True,
        help_text="Date of birth"
    )
    address = models.TextField(
        blank=True,
        null=True,
        help_text="Student's permanent address"
    )

    class Meta:
        db_table = 'students_profiles'
        verbose_name = 'Student Profile'
        verbose_name_plural = 'Student Profiles'
        indexes = [
            models.Index(fields=['class_level', 'section']),
            models.Index(fields=['roll_number', 'class_level']),
            models.Index(fields=['group']),
        ]
        # Business rule: unique roll number per class+section combination
        constraints = [
            models.UniqueConstraint(
                fields=['roll_number', 'class_level', 'section'],
                name='unique_roll_per_class_section'
            )
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - Class {self.class_level}{self.section}"

    def clean(self): # Must use full_clean() in views to trigger this validation
        from django.core.exceptions import ValidationError
        # Validate: group required for class 9-10
        if self.class_level in [9, 10] and not self.group:
            raise ValidationError({
                'group': 'Group is required for Class 9 and 10 students.'
            })
        # Validate: group should be null for class 6-8
        if self.class_level in [6, 7, 8] and self.group:
            raise ValidationError({
                'group': 'Group should not be set for Class 6-8 students.'
            })

    @property
    def full_section(self):
        """Returns like '9A', '7B' etc."""
        return f"{self.class_level}{self.section}"


class TeacherProfile(BaseModel):
    """
    Extended profile for Teacher users.
    One-to-One relationship with User model.
    """
    
    class Department(models.TextChoices):
        SCIENCE = 'Science', 'Science Department'
        HUMANITIES = 'Humanities', 'Humanities Department'
        BUSINESS = 'Business', 'Business Studies Department'
        GENERAL = 'General', 'General Department'
    
    # Core Relationship
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='teacher_profile',
        help_text="Associated user account"
    )
    
    # Professional Information
    employee_id = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text="Unique employee identification number"
    )
    department = models.CharField(
        max_length=50,
        choices=Department.choices,
        help_text="Department the teacher belongs to"
    )
    designation = models.CharField(
        max_length=100,
        help_text="Job designation (e.g., Senior Teacher, Assistant Teacher)"
    )

    class Meta:
        db_table = 'teachers_profiles'
        verbose_name = 'Teacher Profile'
        verbose_name_plural = 'Teacher Profiles'
        indexes = [
            models.Index(fields=['department']),
            models.Index(fields=['employee_id']),
        ]

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.department}"


class ParentStudentLink(BaseModel):
    """
    Maps Parent users to their children (Student users).
    This is the junction table that eliminates many-to-many relationship.
    Industry standard: Access code for secure linking.
    """
    
    class Relationship(models.TextChoices):
        FATHER = 'Father', 'Father'
        MOTHER = 'Mother', 'Mother'
        GUARDIAN = 'Guardian', 'Guardian'
    
    # Relationships
    parent = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='linked_children',
        limit_choices_to={'role': User.Role.PARENT},
        help_text="Parent user who requests the link"
    )
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='linked_parents',
        limit_choices_to={'role': User.Role.STUDENT},
        help_text="Student user being linked"
    )
    
    # Link Details
    access_code = models.CharField(
        max_length=6,
        unique=True,
        editable=False,
        help_text="Auto-generated unique access code for parent-child linking"
    )
    relationship = models.CharField(
        max_length=20,
        choices=Relationship.choices,
        help_text="Relationship between parent and student"
    )

    class Meta:
        db_table = 'parents_students_links'
        verbose_name = 'Parent-Student Link'
        verbose_name_plural = 'Parent-Student Links'
        constraints = [
            # Prevent duplicate parent-student links
            models.UniqueConstraint(
                fields=['parent', 'student'],
                name='unique_parent_student_link'
            )
        ]
        indexes = [
            models.Index(fields=['parent']),
            models.Index(fields=['student']),
            models.Index(fields=['access_code']),
        ]

    def save(self, *args, **kwargs):
        # Auto-generate access code on creation
        if not self.access_code:
            self.access_code = self._generate_access_code()
        super().save(*args, **kwargs)

    def _generate_access_code(self):
        """Generate a unique 6-character alphanumeric access code."""
        import random
        import string
        while True:
            code = ''.join(random.choices(
                string.ascii_uppercase + string.digits, k=6
            ))
            if not ParentStudentLink.objects.filter(access_code=code).exists():
                return code

    def __str__(self):
        return f"{self.parent.get_full_name()} → {self.student.get_full_name()} ({self.relationship})"
    
def default_expiry():
    return timezone.now() + timedelta(minutes=5)


class VerificationCode(BaseModel):

    class VerificationTypeChoices(models.TextChoices):
        ACCOUNT_VERIFICATION = ("ACCOUNT_VERIFICATION", "Account Verification")
        FORGOT_PASSWORD = ("FORGOT_PASSWORD", "Forgot password")
        LOGIN_OTP_VERIFICATION=("LOGIN_OTP_VERIFICATION","Login OTP Verification")
        RESET_PASSWORD_OTP_VERIFICATION=("RESET_PASSWORD_OTP_VERIFICATION","Reset Password OTP Verification")

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="verification_codes_by_user",
        null=True,blank=True
    )

 
    email = models.EmailField()
    code = models.CharField(unique=True, max_length=6)
    type = models.CharField(
        max_length=40,
        choices=VerificationTypeChoices.choices,
        default=VerificationTypeChoices.ACCOUNT_VERIFICATION,
    )
    is_used = models.BooleanField(default=False)
    expires_at = models.DateTimeField(default=default_expiry)

    def save(self,*args,**kwargs):
        if not self.code:
            self.code = f"{random.randint(100000,999999)}" # 6 digit OTP
        super().save(*args,**kwargs)
    
    def is_expired(self):
        return self.expires_at < timezone.now()


