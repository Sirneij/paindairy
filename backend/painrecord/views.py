from painrecord.models import PainRecord
from painrecord.permissions import IsOwnerOrReadOnly
from painrecord.serializers import PainRecordSerializer
from rest_framework import permissions, viewsets
from rest_framework.response import Response
from rest_framework import status


class PainRecordViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """

    queryset = PainRecord.objects.select_related('user')
    serializer_class = PainRecordSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    

    # def create(self, request, *args, **kwargs):
    #     serializer = self.serializer_class(data=request.data, context={'user': request.user})
    #     serializer.is_valid(raise_exception=True)
    #     return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
