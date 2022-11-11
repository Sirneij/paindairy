from painrecord.models import PainRecord
from rest_framework import serializers


class PainRecordSerializer(serializers.ModelSerializer[PainRecord]):
    # user = serializers.RelatedField(source='user', read_only=True)
    # user = UserSerializer(read_only=True)
    user = serializers.ReadOnlyField(source='user.email')

    class Meta:
        model = PainRecord
        fields = '__all__'
