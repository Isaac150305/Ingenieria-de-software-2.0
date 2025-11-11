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
                    'Authorization': `Token ${token}`
                },
                body: formData
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

const formService = new CancionFormService();

const form = document.querySelector("#form-agregar-cancion");

form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const titulo = (document.querySelector("#titulo") as HTMLInputElement).value;
    const nombre_artista = (document.querySelector("#nombre_artista") as HTMLInputElement).value;
    const imagenInput = (document.querySelector("#imagen") as HTMLInputElement);
    
    if (!imagenInput.files || imagenInput.files.length === 0) {
        alert("Por favor, selecciona una imagen de portada.");
        return;
    }
    const imagen = imagenInput.files[0];

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('nombre_artista', nombre_artista);
    formData.append('imagen', imagen);

    const exito = await formService.agregarCancion(formData);

    if (exito) {
        window.location.href = 'canciones.html';
    }
});