# apps/attendance/models.py
from django.db import models
from django.utils import timezone
from core.models import BaseModel


class Attendance(BaseModel):
    """
    Daily attendance record for students.
    Teachers mark attendance for their assigned sections.
    """
    
    class Status(models.TextChoices):
        PRESENT = 'Present', 'Present'
        ABSENT = 'Absent', 'Absent'
        LATE = 'Late', 'Late'
    
    # Relationships
    student = models.ForeignKey(
        'accounts.StudentProfile',
        on_delete=models.CASCADE,
        related_name='attendance_student',
        help_text="Student whose attendance is recorded"
    )
    marked_by = models.ForeignKey(
        'accounts.TeacherProfile',
        on_delete=models.SET_NULL,
        null=True,
        related_name='attendance_marked_by',
        help_text="Teacher who marked this attendance"
    )
    
    # Attendance Details
    date = models.DateField(
        db_index=True,
        help_text="Date of attendance"
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        db_index=True,
        help_text="Attendance status for the day"
    )
    section = models.CharField(
        max_length=10,
        db_index=True,
        help_text="Section identifier (e.g., '7B', '9A')"
    )

    class Meta:
        db_table = 'attendances'
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendance Records'
        constraints = [
            # One attendance record per student per day
            models.UniqueConstraint(
                fields=['student', 'date'],
                name='unique_student_attendance_per_day'
            )
        ]
        indexes = [
            models.Index(fields=['date', 'section']),
            models.Index(fields=['student', 'date']),
            models.Index(fields=['section', 'date']),
            models.Index(fields=['status']),
        ]
        ordering = ['-date']

    def __str__(self):
        return f"{self.student.user.get_full_name()} - {self.status} on {self.date}"

    @classmethod
    def get_monthly_summary(cls, student_id, month, year):
        """Calculate monthly attendance summary for a student."""
        from django.db.models import Count, Q
        
        records = cls.objects.filter(
            student_id=student_id,
            date__month=month,
            date__year=year
        )
        
        total_days = records.count()
        if total_days == 0:
            return None
            
        present_count = records.filter(status=cls.Status.PRESENT).count()
        absent_count = records.filter(status=cls.Status.ABSENT).count()
        late_count = records.filter(status=cls.Status.LATE).count()
        
        # Calculate percentage (Late counts as present percentage-wise)
        attendance_percentage = round(
            ((present_count + late_count) / total_days) * 100, 2
        )
        
        return {
            'total_days': total_days,
            'present': present_count,
            'absent': absent_count,
            'late': late_count,
            'percentage': attendance_percentage
        }

    @classmethod
    def mark_bulk_attendance(cls, section, date, records, marked_by):
        """
        Mark attendance for an entire section at once.
        Args:
            section: Section identifier (e.g., '9A')
            date: Date of attendance
            records: List of {student_id, status} dicts
            marked_by: TeacherProfile instance
        """
        attendance_records = []
        errors = []
        
        for record in records:
            try:
                attendance_records.append(
                    cls(
                        student_id=record['student_id'],
                        date=date,
                        status=record['status'],
                        section=section,
                        marked_by=marked_by
                    )
                )
            except Exception as e:
                errors.append({
                    'student_id': record.get('student_id'),
                    'error': str(e)
                })
        
        if attendance_records:
            # Use bulk_create with ignore_conflicts for efficiency
            cls.objects.bulk_create(
                attendance_records,
                ignore_conflicts=True  # Skip duplicates
            )
        
        return {
            'success_count': len(attendance_records) - len(errors),
            'error_count': len(errors),
            'errors': errors
        }