export const API_BASE_URL = 'http://127.0.0.1:8000';

class Opinion {
    constructor(
        public id: number,
        public usuario: string,
        public comentario: string,
        public calificacion: number,
        public cancion: number
    ) { }
}

class OpinionService {
    private apiUrl = `${API_BASE_URL}/api/opiniones/`;

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

    async publishOpinion(comentario: string, calificacion: number, cancion_id: number): Promise<boolean> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede publicar");
            return false;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
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

class OpinionPage {
    private service = new OpinionService();

    async init() {
        const publishBtn = document.querySelector(".botonPublicar");
        
        publishBtn?.addEventListener("click", async () => {
            const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
            
            const calificacionInput = prompt("Calificación (1-5):");
            const cancionIdInput = prompt("ID de la Canción a reseñar:");

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
        const container = document.querySelector(".opiniones-list");
        if (!container) return;
        
        const opinions = await this.service.fetchOpinions();
        container.innerHTML = '';
        
        opinions.forEach(o =>
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