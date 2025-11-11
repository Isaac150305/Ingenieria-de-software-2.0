from rest_framework import generics, permissions
from .models import Cancion
from .serializers import CancionSerializer

class CancionListCreateAPIView(generics.ListCreateAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(subido_por=self.request.user)