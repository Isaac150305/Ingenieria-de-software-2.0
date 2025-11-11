from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as authtoken_views

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- NUESTRAS APIS ---
    
    # 1. Endpoint de LOGIN (de DRF)
    #    POST a /api/usuarios/login/
    path('api/usuarios/login/', authtoken_views.obtain_auth_token, name='api_token_auth'),
    
    # 2. Endpoints de REGISTRO y PERFIL (de 'usuarios/urls.py')
    #    POST a /api/usuarios/register/
    #    GET a /api/usuarios/profile/
    path('api/usuarios/', include('usuarios.urls')),
    
    # APIs de Musica
    path('api/musica/', include('musica.urls')),

    # Api resenas
    path('api/resenas/', include('resenas.urls')),
    
    # Api playlist
    path('api/playlist/', include('playlist.urls')),
    
    # Api anuncios
    path('api/anuncios/', include('anuncios.urls')),
]