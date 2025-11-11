from rest_framework import serializers
from .models import Anuncio

class AnuncioSerializer(serializers.ModelSerializer):
    """
    Traductor JSON para el modelo Anuncio.
    """
    class Meta:
        model = Anuncio
        
        # Solo exponemos los campos que el frontend necesita
        # No mostramos 'is_active' o 'fecha_creacion'
        fields = ['id', 'titulo', 'description', 'image', 'link']