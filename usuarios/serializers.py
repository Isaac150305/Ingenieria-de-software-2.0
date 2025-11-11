from django.contrib.auth.models import User
from rest_framework import serializers

# ------------------------------------------------------------------
# 1. Serializador para VISUALIZAR el perfil del usuario
#    (Responde a "Visualizar datos del perfil")
# ------------------------------------------------------------------
class UserSerializer(serializers.ModelSerializer):
    """
    Este serializador "traduce" el modelo de Usuario a JSON
    para mostrar sus datos de forma segura.
    """
    class Meta:
        model = User
        
        # --- ¡IMPORTANTE! ---
        # Definimos los campos que el frontend SÍ puede ver.
        # NUNCA incluyas 'password' aquí.
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


# ------------------------------------------------------------------
# 2. Serializador para CREAR un nuevo usuario (Registro)
#    (Responde a "Crear perfil")
# ------------------------------------------------------------------
class UserCreateSerializer(serializers.ModelSerializer):
    """
    Este serializador se usa SÓLO para el registro (Crear perfil).
    Valida los datos y maneja la creación segura de la contraseña.
    """
    
    # --- Configuración especial para la contraseña ---
    # Queremos que la contraseña se pueda escribir (write_only=True)
    # pero que NUNCA se muestre en una respuesta JSON.
    # También la marcamos como obligatoria (required=True).
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        style={'input_type': 'password'} # Ayuda a que en la API se vea como '***'
    )

    class Meta:
        model = User
        
        # Campos que le vamos a PEDIR al frontend para crear el usuario
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
        
        # Hacemos que 'first_name' y 'last_name' no sean obligatorios
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
        }

    # --- El paso MÁS IMPORTANTE de la seguridad ---
    # Sobreescribimos el método 'create'
    
    def create(self, validated_data):
        """
        Esta función se llama cuando el serializador valida los datos.
        Nos aseguramos de HASHEAR (encriptar) la contraseña.
        """
        
        # Obtenemos los datos ya validados
        username = validated_data['username']
        email = validated_data['email']
        password = validated_data['password']
        
        # Obtenemos los datos opcionales (pueden venir vacíos)
        first_name = validated_data.get('first_name', '')
        last_name = validated_data.get('last_name', '')

        # ¡NUNCA HAGAS ESTO! -> User.objects.create(**validated_data)
        # (Guardaría la contraseña en texto plano)
        
        # --- LA FORMA CORRECTA ---
        # Usamos 'create_user' que se encarga de ENCRIPTAR la contraseña
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        
        return user