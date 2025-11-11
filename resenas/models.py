from django.db import models
from django.conf import settings # Para enlazar al Usuario
from musica.models import Cancion # Para enlazar a la Canción
from django.core.validators import MinValueValidator, MaxValueValidator

class Resena(models.Model):
    # --- Conexiones (Claves Foráneas) ---
    
    # 1. El usuario que escribió la reseña
    # related_name='resenas' permite buscar resenas desde un usuario
    usuario = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='resenas'
    )
    
    # 2. La canción que está siendo reseñada
    cancion = models.ForeignKey(
        Cancion, 
        on_delete=models.CASCADE,
        related_name='resenas'
    )

    # --- Campos de la Reseña ---
    
    # 3. El sistema de puntuación por estrellas (¡aquí está!)
    # Usamos un validador para forzar que el número esté entre 1 y 5
    calificacion = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Calificación (1-5 estrellas)"
    )
    
    # 4. El comentario de texto (la opinión)
    comentario = models.TextField(blank=True, null=True, verbose_name="Comentario")
    
    # 5. Fecha de creación
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Regla: Un usuario solo puede escribir UNA reseña por canción.
        unique_together = ('usuario', 'cancion')

    def __str__(self):
        return f'Reseña de {self.usuario.username} para {self.cancion.titulo}'