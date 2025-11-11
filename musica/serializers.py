from rest_framework import serializers
from .models import Cancion

class CancionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cancion
        fields = '__all__'
        read_only_fields = ['subido_por', 'fecha_creacion']