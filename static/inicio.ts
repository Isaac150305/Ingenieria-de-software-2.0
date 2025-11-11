export const API_BASE_URL = 'http://127.0.0.1:8000';

class Announcement {
    constructor(
        public id: number,
        public titulo: string,
        public description: string,
        public image: string,
        public link: string
    ) { }
}

class AnnouncementService {
    private apiUrl = `${API_BASE_URL}/api/anuncios/`;

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

class HomePage {
    private service = new AnnouncementService();

    async init() {
        await this.renderAnnouncements();
    }

    async renderAnnouncements() {
        const container = document.querySelector(".anuncios-list"); 
        if (!container) return;

        const anuncios = await this.service.fetchAnnouncements();
        container.innerHTML = '';
        
        anuncios.forEach(a => {
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