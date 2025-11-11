from rest_framework import generics, permissions
from .models import Resena
from .serializer import ResenaSerializer
from .permissions import IsOwnerOrReadOnly # Nuestro permiso custom

# Vista para "Publicar opinión" (POST) y "Ver todas" (GET)
class ResenaListCreateAPIView(generics.ListCreateAPIView):
    """
    Vista para listar todas las reseñas (GET) o
    publicar una nueva reseña (POST).
    """
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer
    
    # El usuario debe estar logueado para ver o crear reseñas
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        """
        Asigna automáticamente el usuario logueado al crear la reseña.
        """
        serializer.save(usuario=self.request.user)

# Vista para "Eliminar opinión" (DELETE) y "Actualizar" (PUT/PATCH)
class ResenaRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vista para Ver (GET), Actualizar (PUT/PATCH) o 
    Eliminar (DELETE) una reseña específica.
    """
    queryset = Resena.objects.all()
    serializer_class = ResenaSerializer
    
    # ¡Aquí usamos nuestro permiso!
    # Debe estar logueado Y ser el dueño para borrar/editar.
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]