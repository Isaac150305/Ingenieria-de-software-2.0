from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Playlist
from musica.models import Cancion # Necesitamos el modelo Cancion
from .serializers import PlaylistSerializer
from .permissions import IsOwner # Nuestro permiso

# --- CLASE 1: "Crear playlist" (POST) y "Listar mis playlists" (GET) ---
class PlaylistListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = PlaylistSerializer
    permission_classes = [permissions.IsAuthenticated] # Requiere Token

    def get_queryset(self):
        """
        Esta función asegura que el usuario solo vea SUS playlists.
        """
        return Playlist.objects.filter(creador=self.request.user)

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario logueado como 'creador'.
        """
        serializer.save(creador=self.request.user)


# --- CLASE 2: "Agregar canción a playlist" (POST) ---
class AgregarCancionAPIView(APIView):
    # Requiere Token Y ser el dueño de la playlist
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def post(self, request, pk):
        # 'pk' es el ID de la Playlist (viene de la URL)
        try:
            playlist = Playlist.objects.get(pk=pk)
        except Playlist.DoesNotExist:
            return Response({'error': 'Playlist no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        # Aquí se activa nuestro permiso IsOwner
        self.check_object_permissions(request, playlist)
        
        # Buscamos el ID de la canción en el JSON que envía el frontend
        cancion_id = request.data.get('cancion_id')
        if not cancion_id:
            return Response({'error': 'cancion_id no provisto'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            cancion = Cancion.objects.get(pk=cancion_id)
        except Cancion.DoesNotExist:
            return Response({'error': 'Canción no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            
        # --- La Lógica de "Muchos-a-Muchos" ---
        playlist.canciones.add(cancion)
        
        return Response({'mensaje': 'Canción agregada a la playlist'}, status=status.HTTP_200_OK)