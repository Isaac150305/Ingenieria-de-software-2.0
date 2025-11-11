from django.urls import path
from .views import PlaylistListCreateAPIView, AgregarCancionAPIView

urlpatterns = [
    # Ruta: /api/playlists/
    path('playlists/', PlaylistListCreateAPIView.as_view(), name='lista-crear-playlist'),

    # Ruta: /api/playlists/5/add-song/
    path('playlists/<int:pk>/add-song/', AgregarCancionAPIView.as_view(), name='agregar-cancion-playlist'),
]