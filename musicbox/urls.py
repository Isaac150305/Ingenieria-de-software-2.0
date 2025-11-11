from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken import views as authtoken_views

# --- Para servir imágenes (MEDIA_ROOT) ---
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- API URLs CORREGIDAS ---
    path('api/login/', authtoken_views.obtain_auth_token, name='api_token_auth'),

    # El frontend llama a /api/register/ y /api/profile/
    path('api/', include('usuarios.urls')), 

    # El frontend llama a /api/songs/
    path('api/', include('musica.urls')),

    # El frontend llama a /api/opiniones/
    path('api/', include('resenas.urls')),

    # El frontend llama a /api/playlists/
    path('api/', include('playlist.urls')),

    # El frontend llama a /api/anuncios/
    path('api/', include('anuncios.urls')),
]

# --- Añade esto al final ---
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)