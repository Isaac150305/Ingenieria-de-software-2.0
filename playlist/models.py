from django.db import models
from django.conf import settings # Para enlazar al Usuario
from musica.models import Cancion # ¡Importamos la clase Cancion!

class Playlist(models.Model):
    # 1. El nombre de la playlist (ej: "Música para entrenar")
    nombre = models.CharField(max_length=150, verbose_name="Nombre")
    
    # 2. El creador (dueño) de la playlist
    #    Relación Uno-a-Muchos con Usuario
    creador = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='playlists',
        verbose_name="Creador"
    )
    
    # 3. ¡LA MAGIA! El campo "Muchos-a-Muchos"
    #    Le dice a Django que una Playlist puede tener muchas Canciones,
    #    y una Canción puede estar en muchas Playlists.
    canciones = models.ManyToManyField(
        Cancion,
        related_name='playlists',
        blank=True # Permite que una playlist se cree vacía
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.nombre} (de {self.creador.username})'