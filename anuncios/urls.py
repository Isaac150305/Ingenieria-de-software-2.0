from django.urls import path
from .views import AnuncioListAPIView

urlpatterns = [
    # Ruta: /api/anuncios/
    path('anuncios/', AnuncioListAPIView.as_view(), name='lista-anuncios'),
]