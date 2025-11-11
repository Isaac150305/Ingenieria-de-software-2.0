from django.urls import path
from .views import AnuncioListAPIView

urlpatterns = [
    # URL: api/anuncios/
    # GET: Lista todos los anuncios activos
    path('', AnuncioListAPIView.as_view(), name='lista-anuncios'),
]