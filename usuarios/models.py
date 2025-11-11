from django.db import models
from django.utils.translation import gettext_lazy as _


# Modelo de usuario simple solicitado: campos nombre, apellido, nickname, correo y una imagen
class Usuarios(models.Model):
	nombre = models.CharField(_('nombre'), max_length=150)
	apellido = models.CharField(_('apellido'), max_length=150, blank=True)
	nickname = models.CharField(_('nickname'), max_length=150, unique=True)
	correo = models.EmailField(_('correo'), unique=True)
	imagen = models.ImageField(_('imagen'), upload_to='usuarios/', blank=True, null=True)






