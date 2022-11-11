from typing import Any

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@shared_task
def send_email_message(subject: str, template_name: str, user_id: str, ctx: dict[str, Any]) -> None:
    """Celery task to send emails."""
    html_message = render_to_string(template_name, ctx)
    plain_message = strip_tags(html_message)
    mail.send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[get_user_model().objects.get(id=user_id).email],
        fail_silently=False,
        html_message=html_message,
    )


@shared_task
def send_email_message_general(
    subject: str, template_name: str, recipient_list: list[str], ctx: dict[str, Any]
) -> None:
    """Celery task to send emails."""
    html_message = render_to_string(template_name, ctx)
    plain_message = strip_tags(html_message)
    mail.send_mail(
        subject=subject,
        message=plain_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=recipient_list,
        fail_silently=False,
        html_message=html_message,
    )
