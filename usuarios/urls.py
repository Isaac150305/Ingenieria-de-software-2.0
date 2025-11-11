from django.urls import path
from .views import CreateUserAPIView, UserProfileAPIView

urlpatterns = [
    # Ruta: /api/register/
    path('register/', CreateUserAPIView.as_view(), name='register'),

    # Ruta: /api/profile/
    path('profile/', UserProfileAPIView.as_view(), name='profile'),
]