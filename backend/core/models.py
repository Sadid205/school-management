from django.db import models

# Create your models here.
# apps/core/models.py (core app for shared utilities)
from django.db import models
import uuid

class BaseModel(models.Model):
    """
    Abstract base model that all models inherit from.
    Provides UUID primary key and timestamp fields.
    Industry standard: UUID for external references, auto timestamps.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        help_text="Unique identifier for the record"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when the record was created"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        help_text="Timestamp when the record was last updated"
    )

    class Meta:
        abstract = True
        ordering = ['-created_at']