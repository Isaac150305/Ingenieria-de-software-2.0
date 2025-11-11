from django.shortcuts import render

from rest_framework import generics, permissions
from django.contrib.auth.models import User
from .serializers import UserSerializer, UserCreateSerializer

# ------------------------------------------------------------------
# 1. Vista para "Crear perfil" (Registro)
# ------------------------------------------------------------------
class CreateUserAPIView(generics.CreateAPIView):
    """
    Endpoint de API para que cualquier usuario pueda registrarse.
    (Responde a "Crear perfil")
    
    Solo permite peticiones POST.
    """
    # 'queryset' es estándar, le decimos que el modelo base es User
    queryset = User.objects.all()
    
    # Le decimos a esta vista que use nuestro "traductor" de creación
    serializer_class = UserCreateSerializer
    
    # --- ¡IMPORTANTE! ---
    # 'AllowAny': Permite que CUALQUIER usuario (incluso no logueados)
    # pueda acceder a esta vista. Es necesario para el registro.
    permission_classes = [permissions.AllowAny]


# ------------------------------------------------------------------
# 2. Vista para "Visualizar datos del perfil"
# ------------------------------------------------------------------
class UserProfileAPIView(generics.RetrieveAPIView):
    """
    Endpoint de API para que un usuario vea su propio perfil.
    
    Solo permite peticiones GET.
    """
    # Le decimos que use nuestro "traductor" de visualización
    serializer_class = UserSerializer
    
    # --- ¡IMPORTANTE! ---
    # 'IsAuthenticated': Solo permite el acceso a usuarios
    # que estén logueados (es decir, que envíen un Token válido).
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Esta función mágica se sobreescribe para que la vista
        no pida un ID, sino que automáticamente devuelva
        el perfil del usuario que está haciendo la petición.
        """
        # 'self.request.user' es el objeto User que DRF
        # identifica gracias al Token enviado en la petición.
        return self.request.user