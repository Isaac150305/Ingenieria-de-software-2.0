from django.contrib import admin
from .models import Anuncio

@admin.register(Anuncio)
class AnuncioAdmin(admin.ModelAdmin):
    # Columnas que se verán en la lista de anuncios
    list_display = ('titulo', 'link', 'is_active', 'fecha_creacion')
    
    # Filtros que aparecerán a la derecha
    list_filter = ('is_active',)
    
    # Campos por los que se puede buscar
    search_fields = ('titulo', 'description')