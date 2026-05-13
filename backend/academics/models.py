# apps/academics/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import BaseModel


class Subject(BaseModel):
    """
    Subject master data.
    Defines all subjects offered in the school curriculum.
    """
    
    class SubjectType(models.TextChoices):
        COMPULSORY = 'compulsory', 'Compulsory Subject'
        OPTIONAL_4TH = 'optional_4th', 'Optional 4th Subject'
    
    class SubjectGroup(models.TextChoices):
        SCIENCE = 'Science', 'Science'
        HUMANITIES = 'Humanities', 'Humanities'
        BUSINESS = 'Business', 'Business Studies'
        ALL = 'All', 'All Groups'
    
    # Core Fields
    name = models.CharField(
        max_length=100,
        help_text="Full name of the subject (e.g., Bangla, English, Mathematics)"
    )
    code = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        help_text="Unique subject code (e.g., BAN101, ENG101)"
    )
    
    # Classification
    subject_type = models.CharField(
        max_length=20,
        choices=SubjectType.choices,
        default=SubjectType.COMPULSORY,
        db_index=True,
        help_text="Whether this is compulsory or optional 4th subject"
    )
    group = models.CharField(
        max_length=20,
        choices=SubjectGroup.choices,
        default=SubjectGroup.ALL,
        help_text="Subject group (Science/Humanities/Business/All)"
    )
    
    # Class applicability (Stored as JSON array of class levels)
    class_levels = models.JSONField(
        default=list,
        help_text="List of class levels this subject applies to (e.g., [6,7,8] or [9,10])"
    )
    
    # Marks Configuration
    has_practical = models.BooleanField(
        default=False,
        help_text="Does this subject have a practical component?"
    )
    full_marks = models.PositiveSmallIntegerField(
        default=100,
        validators=[MinValueValidator(50), MaxValueValidator(200)],
        help_text="Total full marks for this subject"
    )

    class Meta:
        db_table = 'subjects'
        verbose_name = 'Subject'
        verbose_name_plural = 'Subjects'
        ordering = ['code']
        indexes = [
            models.Index(fields=['subject_type']),
            models.Index(fields=['group']),
        ]

    def __str__(self):
        return f"{self.name} ({self.code})"

    @property
    def is_4th_subject(self):
        return self.subject_type == self.SubjectType.OPTIONAL_4TH


class SubjectAssignment(BaseModel):
    """
    Assigns teachers to specific subjects and sections.
    This eliminates many-to-many between Teacher and Subject-Section.
    Industry standard: Explicit assignment with academic year tracking.
    """
    
    # Relationships
    teacher = models.ForeignKey(
        'accounts.TeacherProfile',
        on_delete=models.CASCADE,
        related_name='subjectassignment_teacher',
        help_text="Teacher assigned to teach this subject"
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='subjectassignment_subject',
        help_text="Subject being taught"
    )
    
    # Assignment Details
    section = models.CharField(
        max_length=10,
        help_text="Section identifier (e.g., '9A', '7B')"
    )
    academic_year = models.CharField(
        max_length=9,
        help_text="Academic year (e.g., '2025-2026')"
    )

    class Meta:
        db_table = 'subjects_assignments'
        verbose_name = 'Subject Assignment'
        verbose_name_plural = 'Subject Assignments'
        constraints = [
            # Prevent duplicate assignments
            models.UniqueConstraint(
                fields=['teacher', 'subject', 'section', 'academic_year'],
                name='unique_teacher_subject_section_year'
            )
        ]
        indexes = [
            models.Index(fields=['section', 'academic_year']),
            models.Index(fields=['teacher', 'academic_year']),
        ]

    def __str__(self):
        return f"{self.teacher.user.get_full_name()} → {self.subject.name} ({self.section})"


class Exam(BaseModel):
    """
    Exam configuration and schedule.
    """
    
    class ExamType(models.TextChoices):
        CLASS_TEST = 'class_test', 'Class Test'
        HALF_YEARLY = 'half_yearly', 'Half Yearly Exam'
        ANNUAL = 'annual', 'Annual/Final Exam'
    
    # Core Fields
    name = models.CharField(
        max_length=200,
        help_text="Exam name (e.g., 'Half-Yearly 2025')"
    )
    exam_type = models.CharField(
        max_length=20,
        choices=ExamType.choices,
        db_index=True,
        help_text="Type of examination"
    )
    class_level = models.IntegerField(
        db_index=True,
        help_text="Class level for which this exam is conducted"
    )
    
    # Schedule
    date = models.DateField(
        help_text="Exam date or start date"
    )
    
    # Status
    is_published = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Whether results have been published"
    )

    class Meta:
        db_table = 'exams'
        verbose_name = 'Exam'
        verbose_name_plural = 'Exams'
        ordering = ['-date']
        indexes = [
            models.Index(fields=['exam_type', 'class_level']),
            models.Index(fields=['is_published']),
        ]

    def __str__(self):
        return f"{self.name} - Class {self.class_level} ({self.exam_type})"



