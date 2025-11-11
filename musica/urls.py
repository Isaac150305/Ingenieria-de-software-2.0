from django.urls import path
from .views import CancionListCreateAPIView

urlpatterns = [
    # Ruta para 'api/musica/canciones/'
    path('canciones/', CancionListCreateAPIView.as_view(), name='lista-crear-canciones'),
]