
// 1. Define la IP y puerto de tu backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

// 2. Clase 'Opinion' (Resena) que coincide con el backend
// (backend 'resenas/models.py')
class Opinion {
    constructor(
        public id: number,
        public usuario: string, // <-- Corregido (es 'usuario', no 'user')
        public comentario: string, // <-- Corregido (es 'comentario', no 'content')
        public calificacion: number, // <-- Añadido
        public cancion: number // <-- Añadido
    ) { }
}

class OpinionService {
    // 3. URL Corregida (apunta a la que creamos en 'resenas/urls.py')
    private apiUrl = `${API_BASE_URL}/api/opiniones/`; // (Esta fue la que corregimos)

    /**
     * Busca TODAS las opiniones.
     * ¡Debe enviar el Token!
     */
    async fetchOpinions(): Promise<Opinion[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return [];
        }

        try {
            const res = await fetch(this.apiUrl, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (!res.ok) {
                console.error("Error al cargar opiniones");
                return [];
            }
            return res.json();
        } catch (err) {
            console.error("Error en fetch de opiniones:", err);
            return [];
        }
    }

    /**
     * Publica una nueva opinión.
     * ¡Debe enviar el Token y TODOS los datos!
     */
    async publishOpinion(comentario: string, calificacion: number, cancion_id: number): Promise<boolean> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede publicar");
            return false;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                // 4. Body Corregido (coincide con 'resenas/models.py')
                body: JSON.stringify({ 
                    comentario: comentario,
                    calificacion: calificacion,
                    cancion: cancion_id 
                }),
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Token ${token}`
                }
            });

            if (res.ok) {
                alert("¡Opinión publicada!");
                return true;
            } else {
                const err = await res.json();
                alert(`Error al publicar: ${JSON.stringify(err)}`);
                return false;
            }
        } catch (err) {
            console.error("Error en fetch de publishOpinion:", err);
            return false;
        }
    }
}

// ==========================================================
// MANEJADOR DE LA PÁGINA
// (Actualizado para enviar TODOS los datos)
// ==========================================================
class OpinionPage {
    private service = new OpinionService();

    async init() {
        const publishBtn = document.querySelector(".botonPublicar"); // Asumo que este botón existe
        
        publishBtn?.addEventListener("click", async () => {
            const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
            
            // --- ¡Simulación! Debes añadir estos inputs en tu HTML ---
            const calificacionInput = prompt("Calificación (1-5):");
            const cancionIdInput = prompt("ID de la Canción a reseñar:");
            // --- Fin Simulación ---

            if (textarea?.value && calificacionInput && cancionIdInput) {
                const calificacion = parseInt(calificacionInput);
                const cancion_id = parseInt(cancionIdInput);
                
                await this.service.publishOpinion(textarea.value, calificacion, cancion_id);
                await this.renderOpinions();
            }
        });
        
        await this.renderOpinions();
    }

    async renderOpinions() {
        const container = document.querySelector(".opiniones-list"); // Asumo que este div existe
        if (!container) return;
        
        const opinions = await this.service.fetchOpinions();
        container.innerHTML = '';
        
        opinions.forEach(o =>
            // Usamos los campos correctos: 'usuario' y 'comentario'
            container.innerHTML += `
                <div class="tarjeta-opinion">
                    <p><strong>@${o.usuario}</strong> (${o.calificacion} estrellas)</p>
                    <p>${o.comentario}</p>
                    <button class="boton">Eliminar</button>
                </div>
            `
        );
    }
}

window.addEventListener("DOMContentLoaded", () => new OpinionPage().init());