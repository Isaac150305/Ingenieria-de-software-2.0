// ==========================================================
// static/playlists.ts (¡El Código Corregido!)
// ==========================================================

// 1. Define la IP y puerto de tu backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

// ==========================================================
// CLASE 'Playlist' (Arregla el Error 3)
// (Ahora coincide con nuestro 'playlist/serializers.py')
// ==========================================================
class Playlist {
    constructor(
        public id: number,
        public nombre: string, // <-- Corregido
        public creador: string,
        public canciones: any[] // <-- Corregido (recibimos la lista, no un contador)
    ) { }
}

// ==========================================================
// CLASE DE SERVICIO DE PLAYLISTS
// (Arregla Errores 1 y 2)
// ==========================================================
class PlaylistService {
    
    // URL Corregida (apunta a la que creamos en 'playlist/urls.py')
    private apiUrl = `${API_BASE_URL}/api/playlists/`;

    /**
     * Busca las playlists del usuario logueado.
     * ¡Debe enviar el Token!
     */
    async fetchPlaylists(): Promise<Playlist[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return [];
        }

        try {
            // Añadimos el header de Autorización
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

    /**
     * Crea una nueva playlist.
     * ¡Debe enviar el Token!
     */
    async createPlaylist(name: string): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede crear playlist");
            return;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: "POST",
                // El backend espera 'nombre', no 'name'
                body: JSON.stringify({ nombre: name }), // <-- Corregido
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

// ==========================================================
// MANEJADOR DE LA PÁGINA
// (Actualizado para usar los nombres de campo correctos)
// ==========================================================
class PlaylistPage {
    private service = new PlaylistService();

    async init() {
        // ¡OJO! Tu HTML 'playlists.html' no tiene un botón con clase '.botonCrear'
        // Asegúrate de que tu botón 'Crear nueva playlist' tenga ese ID o clase
        document.querySelector(".botonCrear")?.addEventListener("click", async () => {
            const name = prompt("Nombre de la nueva playlist:");
            if (name) await this.service.createPlaylist(name);
            await this.renderPlaylists();
        });
        
        await this.renderPlaylists();
    }

    async renderPlaylists() {
        // ¡OJO! Tu HTML 'playlists.html' no tiene un '.playlists-list'
        // Debes crear un <div> con esa clase
        const container = document.querySelector(".playlists-list");
        if (!container) return;

        const playlists = await this.service.fetchPlaylists();
        
        container.innerHTML = ''; // Limpia el contenedor
        
        playlists.forEach(p => {
            // Usamos 'p.nombre' y 'p.canciones.length'
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