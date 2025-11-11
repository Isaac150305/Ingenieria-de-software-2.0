from django.urls import path
from .views import ResenaListCreateAPIView, ResenaRetrieveUpdateDestroyAPIView

urlpatterns = [
    # Ruta para 'api/resenas/' (Listar y Crear)
    path('', ResenaListCreateAPIView.as_view(), name='lista-crear-resenas'),

    # Ruta para 'api/resenas/<id>/' (Ver, Actualizar, Borrar)
    path('<int:pk>/', ResenaRetrieveUpdateDestroyAPIView.as_view(), name='detalle-resena'),
]