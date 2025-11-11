

// 1. Define la IP y puerto de tu backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

class CancionFormService {
    
    
    private apiUrl = `${API_BASE_URL}/api/songs/`; 

    
    async agregarCancion(formData: FormData): Promise<boolean> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return false;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    // ¡OJO! NO ponemos 'Content-Type'. 
                    // El navegador lo pone automáticamente
                    // como 'multipart/form-data' cuando usas FormData.
                    'Authorization': `Token ${token}`
                },
                body: formData // Enviamos el objeto FormData
            });

            if (res.ok) {
                alert("¡Canción agregada exitosamente!");
                return true;
            } else {
                const err = await res.json();
                alert(`Error al agregar: ${JSON.stringify(err)}`);
                return false;
            }
        } catch (err) {
            console.error("Error en fetch de agregarCancion:", err);
            return false;
        }
    }
}

// ==========================================================
// MANEJADOR DEL FORMULARIO
// ==========================================================

const formService = new CancionFormService();

// 1. Buscamos el formulario por su ID
const form = document.querySelector("#form-agregar-cancion");

// 2. Escuchamos el evento 'submit' (en lugar de 'click' en el botón)
form?.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 3. Obtenemos los valores de los inputs
    const titulo = (document.querySelector("#titulo") as HTMLInputElement).value;
    const nombre_artista = (document.querySelector("#nombre_artista") as HTMLInputElement).value;
    const imagenInput = (document.querySelector("#imagen") as HTMLInputElement);
    
    // 4. Verificamos que se haya seleccionado un archivo
    if (!imagenInput.files || imagenInput.files.length === 0) {
        alert("Por favor, selecciona una imagen de portada.");
        return;
    }
    const imagen = imagenInput.files[0];

    // 5. Creamos el objeto FormData
    // (Estos nombres 'titulo', 'nombre_artista', 'imagen' DEBEN
    // coincidir con los campos de 'musica/models.py')
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('nombre_artista', nombre_artista);
    formData.append('imagen', imagen);

    // 6. Enviamos el formulario
    const exito = await formService.agregarCancion(formData);

    if (exito) {
        // Si tuvo éxito, redirigimos al catálogo de canciones
        window.location.href = 'canciones.html';
    }
});