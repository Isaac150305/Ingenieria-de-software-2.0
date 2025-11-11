from rest_framework import serializers
from .models import Resena

class ResenaSerializer(serializers.ModelSerializer):
    """
    Traductor JSON para el modelo Resena.
    """
    
    # Para que al "leer" la reseña, veamos el nombre de usuario
    # en lugar de solo su ID.
    usuario = serializers.ReadOnlyField(source='usuario.username')

    class Meta:
        model = Resena
        
        # Incluimos todos los campos del modelo
        fields = '__all__'
        
        # Hacemos 'usuario' de solo lectura, porque lo 
        # asignaremos automáticamente desde el Token.
        read_only_fields = ['usuario', 'fecha_creacion']

    def validate(self, data):
        """
        Validación extra: Asegurarse de que el usuario no reseñe su propia canción.
        (Esto es opcional, pero es buena práctica)
        """
        # 'data' contiene la 'cancion' que se está reseñando
        # 'self.context['request'].user' es el usuario que hace la petición
        
        if data['cancion'].subido_por == self.context['request'].user:
            raise serializers.ValidationError("No puedes reseñar tu propia canción.")
        return data