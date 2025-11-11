from rest_framework import serializers
from .models import Playlist
from musica.serializers import CancionSerializer # ¡Reutilizamos código!

class PlaylistSerializer(serializers.ModelSerializer):
    """
    Traductor JSON para el modelo Playlist.
    """
    
    # Muestra el nombre del creador en lugar de solo su ID
    creador = serializers.ReadOnlyField(source='creador.username')
    
    # --- Serializador Anidado ---
    # Muestra la *lista completa* de objetos Cancion
    # usando el 'CancionSerializer' que ya creamos en la app 'musica'.
    canciones = CancionSerializer(many=True, read_only=True)

    class Meta:
        model = Playlist
        
        # 'canciones' se mostrará, pero no se pedirá al crear.
        fields = ['id', 'nombre', 'creador', 'fecha_creacion', 'canciones']
        
        # No se puede editar el creador ni la lista de canciones directamente
        read_only_fields = ['creador', 'canciones']