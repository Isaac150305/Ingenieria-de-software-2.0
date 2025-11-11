from django.urls import path
from .views import CreateUserAPIView, UserProfileAPIView

urlpatterns = [
    # Ruta para el registro: se verá como 'api/usuarios/register/'
    path('register/', CreateUserAPIView.as_view(), name='register'),
    
    # Ruta para ver el perfil: se verá como 'api/usuarios/profile/'
    path('profile/', UserProfileAPIView.as_view(), name='profile'),
]