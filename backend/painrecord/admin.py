from django.contrib import admin
from painrecord.models import PainRecord


@admin.register(PainRecord)
class MeterAdmin(admin.ModelAdmin):
    list_display = ['id', 'get_email', 'pain_intensity', 'pain_questions', 'pain_date']
    list_per_page = 20

    def get_email(self, obj: PainRecord) -> str:
        return obj.user.email

    get_email.admin_order_field = 'user'  # Allows column order sorting
    get_email.short_description = 'User email'  # Renames column head
