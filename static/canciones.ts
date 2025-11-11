// ==========================================================
// static/canciones.ts (¡El Código Corregido!)
// ==========================================================

// 1. Define la IP y puerto de tu backend
export const API_BASE_URL = 'http://127.0.0.1:8000';

// ==========================================================
// CLASE 'Song' (Arregla el Error 5)
// (Ahora coincide con nuestro 'musica/models.py')
// ==========================================================
class Song {
    constructor(
        public id: number,
        public titulo: string, // <-- Corregido
        public nombre_artista: string, // <-- Corregido
        public imagen: string // <-- Añadido
    ) { }
}

// ==========================================================
// CLASE DE SERVICIO DE CANCIONES
// (Arregla Errores 1, 2, 3 y 4)
// ==========================================================
class SongService {
    
    // URL Corregida (apunta a la que creamos en 'musica/urls.py')
    private apiUrl = `${API_BASE_URL}/api/songs/`; // (Esta era la URL del frontend, pero la corregimos en el backend)

    /**
     * Busca todas las canciones.
     * ¡Debe enviar el Token!
     */
    async fetchSongs(query: string = ""): Promise<Song[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return [];
        }

        try {
            // Añadimos el header de Autorización
            const res = await fetch(`${this.apiUrl}?search=${encodeURIComponent(query)}`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (!res.ok) {
                console.error("Error al cargar canciones");
                return [];
            }
            return res.json();
        } catch (err) {
            console.error("Error en fetch de canciones:", err);
            return [];
        }
    }

    /**
     * Agrega una canción a una playlist.
     * ¡Debe enviar el Token!
     */
    async addToPlaylist(songId: number, playlistId: number): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede agregar a playlist");
            return;
        }

        // --- ¡URL Y DATOS CORREGIDOS! ---
        // 1. La URL usa 'agregar' (como en 'playlist/urls.py')
        // 2. El body envía 'cancion_id' (como en 'playlist/views.py')
        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/agregar/`, {
                method: "POST",
                body: JSON.stringify({ cancion_id: songId }), // <-- Corregido
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': `Token ${token}`
                }
            });

            if (res.ok) {
                alert("¡Canción agregada!");
            } else {
                const err = await res.json();
                alert(`Error al agregar: ${JSON.stringify(err)}`);
            }
        } catch (err) {
            console.error("Error en fetch de addToPlaylist:", err);
        }
    }
}

// ==========================================================
// MANEJADOR DE LA PÁGINA
// (Actualizado para usar los nombres de campo correctos)
// ==========================================================
class SongPage {
    private songService = new SongService();

    async init() {
        const searchInput = document.querySelector<HTMLInputElement>("input[type=text]");
        
        // ¡OJO! Tu HTML 'canciones.html' no tiene un contenedor con la clase
        // 'catalogo-canciones'. Asegúrate de que exista.
        // Ej: <section><div class_=".catalogo-canciones"> ... </div></section>
        const container = document.querySelector(".catalogo-canciones"); 

        searchInput?.addEventListener("input", async () => {
            await this.renderSongs(searchInput.value, container);
        });

        // Carga inicial
        await this.renderSongs("", container);
    }

    async renderSongs(query: string, container: Element | null) {
        if (!container) return;

        const songs = await this.songService.fetchSongs(query);
        
        container.innerHTML = ''; // Limpia el contenedor
        
        songs.forEach(song => {
            const card = document.createElement("div");
            card.className = 'tarjeta-cancion'; // Usa la clase de tu CSS
            
            // Usamos los nombres de campo correctos: 'titulo' y 'nombre_artista'
            card.innerHTML = `
                <h3>${song.titulo} - ${song.nombre_artista}</h3>
                <img src="${song.imagen}" alt="${song.titulo}" width="100">
                <button class="ver-resenas" data-song-id="${song.id}">Ver Reseñas</button>
                <button class="add-playlist" data-song-id="${song.id}">Añadir a playlist</button>
            `;
            container.appendChild(card);
        });

        // Añadir manejadores de eventos a los botones nuevos
        container.querySelectorAll('.add-playlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const songId = (e.target as HTMLElement).dataset.songId;
                if (songId) {
                    // Simulación: ¡deberías preguntar a qué playlist!
                    const playlistId = prompt("¿A qué ID de playlist quieres agregarla?");
                    if (playlistId) {
                        this.songService.addToPlaylist(parseInt(songId), parseInt(playlistId));
                    }
                }
            });
        });
    }
}

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => new SongPage().init());