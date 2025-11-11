from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permiso personalizado para solo permitir a los dueños
    de un objeto editarlo o borrarlo.
    """
    def has_object_permission(self, request, view, obj):
        # Permisos de lectura (GET, HEAD, OPTIONS) se permiten a todos
        if request.method in permissions.SAFE_METHODS:
            return True

        # Permisos de escritura (PUT, DELETE) solo se permiten
        # si el usuario de la petición es el mismo que el 'usuario' del objeto
        return obj.usuario == request.user