from django.urls import path
from .views import PlaylistListCreateAPIView, AgregarCancionAPIView

urlpatterns = [
    # URL: api/playlist/
    # GET: Lista mis playlists
    # POST: Crea una nueva playlist
    path('', PlaylistListCreateAPIView.as_view(), name='lista-crear-playlist'),

    # URL: api/playlist/5/agregar/
    # POST: Agrega una canción (pasada en el body) a la playlist 5
    path('<int:pk>/agregar/', AgregarCancionAPIView.as_view(), name='agregar-cancion-playlist'),
]