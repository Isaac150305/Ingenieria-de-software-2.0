from rest_framework import generics, permissions
from .models import Anuncio
from .serializers import AnuncioSerializer

class AnuncioListAPIView(generics.ListAPIView):
    """
    Vista de API de "solo lectura" para "Ver anuncios".
    
    Solo devuelve anuncios que estén marcados como 'is_active = True'.
    """
    serializer_class = AnuncioSerializer
    
    # Cualquiera puede ver los anuncios, no se requiere Token
    permission_classes = [permissions.AllowAny] 

    def get_queryset(self):
        """
        Esta función filtra los resultados.
        Solo devuelve los anuncios que estén activos.
        """
        return Anuncio.objects.filter(is_active=True)