from django.db import models
from django.conf import settings # Para enlazar al usuario

# --- Modelo ÚNICO para la App 'musica' ---

class Cancion(models.Model):
    # "el nombre" (que mencionaste)
    titulo = models.CharField(max_length=150, verbose_name="Título")
    
    # Un campo de texto simple para el nombre del artista
    nombre_artista = models.CharField(max_length=100, verbose_name="Nombre del Artista")
    
    # "una imagen del álbum que la persona suba"
    imagen = models.ImageField(
        upload_to='portadas_canciones/', 
        verbose_name="Imagen de Portada"
    )
    
    # BONUS: Guardemos quién agregó la canción
    # 'settings.AUTH_USER_MODEL' es una referencia al modelo 'User'
    # 'on_delete=models.SET_NULL' = si se borra el usuario, la canción NO se borra.
    subido_por = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        on_delete=models.SET_NULL,
        related_name='canciones_subidas',
        verbose_name="Subido por"
    )
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.titulo} - {self.nombre_artista}'