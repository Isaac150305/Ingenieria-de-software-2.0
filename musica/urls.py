from django.urls import path
# ¡Esta es la importación correcta! Solo importa la vista de Cancion
from .views import CancionListCreateAPIView 

urlpatterns = [
    # Ruta: /api/songs/
    path('songs/', CancionListCreateAPIView.as_view(), name='lista-crear-canciones'),
]