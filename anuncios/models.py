import random
from django.db import models

def generar_id_aleatorio():
    return random.randint(100000000, 999999999)

class Anuncio(models.Model):

    id = models.IntegerField(default=generar_id_aleatorio, help_text="ID único del anuncio")
    titulo = models.CharField(max_length=47, help_text="Título del anuncio")
    descripcion = models.CharField(max_length=47, help_text="Descripción detallada")
    activo = models.BooleanField(default=True, help_text="Indica si el anuncio está publicado (True) o no publicado (False)")
    imagen = models.ImageField(upload_to='anuncios/', blank=True, null=True, help_text="Imagen asociada al anuncio")

  

        