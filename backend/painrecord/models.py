import uuid

from django.contrib.auth import get_user_model
from django.core.serializers.json import DjangoJSONEncoder
from django.db import models


class BaseModel(models.Model):
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_datetime']
        abstract = True


class PainRecord(BaseModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(get_user_model(), related_name='pain_records', on_delete=models.CASCADE)
    pain_intensity = models.DecimalField(max_digits=4, decimal_places=2)
    pain_questions = models.JSONField(default=list, encoder=DjangoJSONEncoder, blank=True, null=True)
    pain_date = models.DateField(auto_now=False, auto_now_add=False, blank=True, null=True)

    def __str__(self) -> str:
        return f'Pain - {self.id}:{self.user.email}'
