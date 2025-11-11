from django.db import models

class Anuncio(models.Model): # <-- ¡ARREGLADO!
    # --- Campos traducidos para consistencia ---
    titulo = models.CharField(max_length=200, verbose_name="Título")
    description = models.TextField(blank=True, null=True, verbose_name="Descripción")
    image = models.ImageField(upload_to='ads/', verbose_name="Imagen")
    link = models.URLField(max_length=500, verbose_name="Enlace")
    is_active = models.BooleanField(default=True, verbose_name="Está Activo")
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.titulo