export const API_BASE_URL = 'http://127.0.0.1:8000';

class Playlist {
    constructor(
        public id: number,
        public nombre: string,
        public creador: string,
        public canciones: any[]
    ) { }
}

class PlaylistService {
    private apiUrl = `${API_BASE_URL}/api/playlists/`;

    async fetchPlaylists(): Promise<Playlist[]> {
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
                console.error("Error al cargar playlists");
                return [];
            }
            return res.json();
        } catch (err) {
            console.error("Error en fetch de playlists:", err);
            return [];
        }
    }

    async createPlaylist(name: string): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede crear playlist");
            return;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                body: JSON.stringify({ nombre: name }),
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Token ${token}`
                }
            });

            if (res.ok) {
                alert("¡Playlist creada!");
            } else {
                const err = await res.json();
                alert(`Error al crear: ${JSON.stringify(err)}`);
            }
        } catch (err) {
            console.error("Error en fetch de createPlaylist:", err);
        }
    }
}

class PlaylistPage {
    private service = new PlaylistService();

    async init() {
        document.querySelector(".botonCrear")?.addEventListener("click", async () => {
            const name = prompt("Nombre de la nueva playlist:");
            if (name) await this.service.createPlaylist(name);
            await this.renderPlaylists();
        });
        
        await this.renderPlaylists();
    }

    async renderPlaylists() {
        const container = document.querySelector(".playlists-list");
        if (!container) return;

        const playlists = await this.service.fetchPlaylists();
        
        container.innerHTML = '';
        
        playlists.forEach(p => {
            container.innerHTML += `
                <div class="tarjeta-playlist">
                    <h3>${p.nombre}</h3>
                    <p>${p.canciones.length} canciones</p>
                    <button class="boton" data-playlist-id="${p.id}">Agregar canción</button>
                </div>
            `;
        });
    }
}

window.addEventListener("DOMContentLoaded", () => new PlaylistPage().init());