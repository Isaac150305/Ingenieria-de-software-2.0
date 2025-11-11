

export const API_BASE_URL = 'http://127.0.0.1:8000';

class Announcement {
    constructor(
        public id: number,
        public titulo: string, // <-- Corregido
        public description: string, // <-- Corregido
        public image: string,
        public link: string
    ) { }
}

class AnnouncementService {
    // 3. URL Corregida (apunta a la que creamos en 'anuncios/urls.py')
    private apiUrl = `${API_BASE_URL}/api/anuncios/`;

    /**
     * Busca todos los anuncios activos.
     * (¡Este no necesita Token!)
     */
    async fetchAnnouncements(): Promise<Announcement[]> {
        try {
            const res = await fetch(this.apiUrl);
            if (!res.ok) {
                console.error("Error al cargar anuncios");
                return [];
            }
            return res.json();
        } catch (err) {
            console.error("Error en fetch de anuncios:", err);
            return [];
        }
    }
}

// ==========================================================
// MANEJADOR DE LA PÁGINA
// (Actualizado para usar los nombres de campo correctos)
// ==========================================================
class HomePage {
    private service = new AnnouncementService();

    async init() {
        await this.renderAnnouncements();
    }

    async renderAnnouncements() {
        // Tu 'inicio.html' no tiene '.anuncios-list', ¡añádelo!
        const container = document.querySelector(".anuncios-list"); 
        if (!container) return;

        const anuncios = await this.service.fetchAnnouncements();
        container.innerHTML = '';
        
        anuncios.forEach(a => {
            // Usamos 'a.titulo' y 'a.description'
            container.innerHTML += `
                <div class="tarjeta-anuncio">
                    <a href="${a.link}" target="_blank">
                        <h4>${a.titulo}</h4>
                        <p>${a.description}</p>
                    </a>
                </div>
            `;
        });
    }
}

window.addEventListener("DOMContentLoaded", () => new HomePage().init());