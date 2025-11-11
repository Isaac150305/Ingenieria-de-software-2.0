from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Permiso personalizado para solo permitir a los dueños
    (el 'creador') de un objeto editarlo.
    """
    def has_object_permission(self, request, view, obj):
        # 'obj' es la Playlist que estamos revisando
        # ¿Es el creador de la playlist igual al usuario que hace la petición?
        return obj.creador == request.user