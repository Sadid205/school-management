# apps/marks/models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from core.models import BaseModel


class StudentMark(BaseModel):
    """
    Individual subject marks for a student in a specific exam.
    Core table for the GPA calculation engine.
    """
    
    # Relationships
    student = models.ForeignKey(
        'accounts.StudentProfile',
        on_delete=models.CASCADE,
        related_name='studentmark_student',
        help_text="Student receiving these marks"
    )
    exam = models.ForeignKey(
        'academics.Exam',
        on_delete=models.CASCADE,
        related_name='studentmark_exam',
        help_text="Exam for which marks are entered"
    )
    subject = models.ForeignKey(
        'academics.Subject',
        on_delete=models.CASCADE,
        related_name='studentmark_subject',
        help_text="Subject for which marks are entered"
    )
    
    # Marks Breakdown (BD System: Written + MCQ + Practical)
    marks_written = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(75)],
        help_text="Marks obtained in written exam (0-75)"
    )
    marks_mcq = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(25)],
        help_text="Marks obtained in MCQ exam (0-25)"
    )
    marks_practical = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(25)],
        help_text="Marks obtained in practical exam (0-25), null for non-practical subjects"
    )
    
    # Status
    is_absent = models.BooleanField(
        default=False,
        help_text="Was the student absent for this exam?"
    )
    
    # Auto-calculated Fields
    total_marks = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        blank=True,
        null=True,
        help_text="Auto-calculated total marks (written + MCQ + practical)"
    )
    letter_grade = models.CharField(
        max_length=3,
        blank=True,
        null=True,
        help_text="Auto-calculated letter grade (A+, A, A-, B, C, D, F)"
    )
    grade_point = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        blank=True,
        null=True,
        help_text="Auto-calculated grade point (5.0, 4.0, 3.5, 3.0, 2.0, 1.0, 0.0)"
    )

    class Meta:
        db_table = 'students_marks'
        verbose_name = 'Student Mark'
        verbose_name_plural = 'Student Marks'
        constraints = [
            # One marks entry per student per exam per subject
            models.UniqueConstraint(
                fields=['student', 'exam', 'subject'],
                name='unique_student_exam_subject'
            )
        ]
        indexes = [
            models.Index(fields=['exam', 'subject']),
            models.Index(fields=['student', 'exam']),
            models.Index(fields=['letter_grade']),
        ]

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.subject.name} ({self.exam.name})"

    def save(self, *args, **kwargs):
        # Auto-calculate total marks, grade, and grade point if all components are present
        if not self.is_absent and self.marks_written is not None and self.marks_mcq is not None:
            self.calculate_results()
        elif self.is_absent:
            self.total_marks = 0
            self.letter_grade = 'F'
            self.grade_point = 0.0
        super().save(*args, **kwargs)

    def calculate_results(self):
        """Calculate total marks, letter grade, and grade point based on BD 5.0 scale."""
        # Calculate total
        total = self.marks_written + self.marks_mcq
        if self.marks_practical is not None:
            total += self.marks_practical
        
        self.total_marks = total
        
        # Determine grade based on BD 5.0 grading scale
        self.letter_grade, self.grade_point = self._get_grade_point(total)

    def _get_grade_point(self, marks):
        """
        BD 5.0 Grading Scale:
        A+ : 80-100 → 5.0
        A  : 70-79  → 4.0
        A- : 60-69  → 3.5
        B  : 50-59  → 3.0
        C  : 40-49  → 2.0
        D  : 33-39  → 1.0
        F  : 0-32   → 0.0
        """
        if marks >= 80:
            return 'A+', 5.0
        elif marks >= 70:
            return 'A', 4.0
        elif marks >= 60:
            return 'A-', 3.5
        elif marks >= 50:
            return 'B', 3.0
        elif marks >= 40:
            return 'C', 2.0
        elif marks >= 33:
            return 'D', 1.0
        else:
            return 'F', 0.0


class StudentResult(BaseModel):
    """
    Overall GPA result for a student in a specific exam.
    Calculated when exam is published.
    Handles the 4th subject rule of BD education system.
    """
    
    # Relationships
    student = models.ForeignKey(
        'accounts.StudentProfile',
        on_delete=models.CASCADE,
        related_name='studentresult_student',
        help_text="Student for whom result is calculated"
    )
    exam = models.ForeignKey(
        'academics.Exam',
        on_delete=models.CASCADE,
        related_name='studentresult_exam',
        help_text="Exam for which result is calculated"
    )
    
    # Calculated Result Fields
    gpa = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        help_text="Calculated GPA on 5.0 scale"
    )
    total_marks = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        help_text="Sum of all subject marks"
    )
    total_grade_points = models.DecimalField(
        max_digits=5,
        decimal_places=1,
        help_text="Sum of grade points from all subjects"
    )
    number_of_subjects = models.PositiveSmallIntegerField(
        help_text="Number of subjects considered"
    )
    
    # Ranking
    class_position = models.PositiveIntegerField(
        blank=True,
        null=True,
        help_text="Class position/rank"
    )
    
    # Status
    is_passed = models.BooleanField(
        default=True,
        help_text="Did the student pass all compulsory subjects?"
    )

    class Meta:
        db_table = 'students_results'
        verbose_name = 'Student Result'
        verbose_name_plural = 'Student Results'
        constraints = [
            # One result per student per exam
            models.UniqueConstraint(
                fields=['student', 'exam'],
                name='unique_student_exam_result'
            )
        ]
        indexes = [
            models.Index(fields=['exam', 'gpa']),
            models.Index(fields=['exam', 'class_position']),
            models.Index(fields=['student', 'exam']),
        ]

    def __str__(self):
        return f"{self.student.user.get_full_name()} - GPA: {self.gpa} ({self.exam.name})"

    @classmethod
    def calculate_gpa(cls, student, exam):
        """
        Main GPA calculation engine implementing BD 5.0 scale with 4th subject rule.
        
        BD 4th Subject Rule:
        - If the 4th subject's grade point is > 2.0, bonus = (4th_subject_GP - 2.0)
        - This bonus is added to total grade points
        - Maximum GPA cap is 5.0
        """
        student_marks = StudentMark.objects.filter(
            student=student,
            exam=exam
        ).select_related('subject')

        if not student_marks.exists():
            return None

        # Separate compulsory and optional subjects
        compulsory_marks = []
        optional_marks = []

        for mark in student_marks:
            if mark.subject.is_4th_subject:
                optional_marks.append(mark)
            else:
                compulsory_marks.append(mark)

        # Check if student failed in any compulsory subject
        has_failure = any(
            mark.grade_point == 0.0 for mark in compulsory_marks
        )

        if has_failure:
            return cls._create_fail_result(student, exam, student_marks)

        # Calculate GPA for compulsory subjects
        total_grade_points = sum(
            mark.grade_point for mark in compulsory_marks
        )
        total_marks = sum(
            mark.total_marks for mark in student_marks
        )

        # Apply 4th subject rule
        fourth_subject_bonus = 0
        if optional_marks:
            fourth_mark = optional_marks[0]  # Take first optional subject
            if fourth_mark.grade_point > 2.0:
                fourth_subject_bonus = fourth_mark.grade_point - 2.0

        # Calculate final GPA
        num_compulsory = len(compulsory_marks)
        gpa = (total_grade_points + fourth_subject_bonus) / num_compulsory

        # Cap GPA at 5.0
        gpa = min(gpa, 5.0)
        gpa = round(gpa, 1)

        return cls.objects.create(
            student=student,
            exam=exam,
            gpa=gpa,
            total_marks=total_marks,
            total_grade_points=total_grade_points + fourth_subject_bonus,
            number_of_subjects=num_compulsory,
            is_passed=True
        )

    @classmethod
    def _create_fail_result(cls, student, exam, marks):
        """Create result for failed students."""
        total_marks = sum(mark.total_marks for mark in marks)
        return cls.objects.create(
            student=student,
            exam=exam,
            gpa=0.0,
            total_marks=total_marks,
            total_grade_points=0.0,
            number_of_subjects=marks.count(),
            is_passed=False
        )

    @classmethod
    def calculate_class_positions(cls, exam):
        """Calculate and assign class positions for all students in an exam."""
        results = cls.objects.filter(exam=exam).order_by('-gpa', '-total_marks')
        for position, result in enumerate(results, start=1):
            result.class_position = position
            result.save(update_fields=['class_position'])