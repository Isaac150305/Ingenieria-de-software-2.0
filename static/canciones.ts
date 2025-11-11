export const API_BASE_URL = 'http://127.0.0.1:8000';

class Song {
    constructor(
        public id: number,
        public titulo: string,
        public nombre_artista: string,
        public imagen: string
    ) { }
}

class SongService {
    private apiUrl = `${API_BASE_URL}/api/songs/`;

    async fetchSongs(query: string = ""): Promise<Song[]> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return [];
        }

        try {
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

    async addToPlaylist(songId: number, playlistId: number): Promise<void> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, no se puede agregar a playlist");
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/playlists/${playlistId}/agregar/`, {
                method: "POST",
                body: JSON.stringify({ cancion_id: songId }),
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

class SongPage {
    private songService = new SongService();

    async init() {
        const searchInput = document.querySelector<HTMLInputElement>("input[type=text]");
        const container = document.querySelector(".catalogo-canciones"); 

        searchInput?.addEventListener("input", async () => {
            await this.renderSongs(searchInput.value, container);
        });

        await this.renderSongs("", container);
    }

    async renderSongs(query: string, container: Element | null) {
        if (!container) return;

        const songs = await this.songService.fetchSongs(query);
        
        container.innerHTML = '';
        
        songs.forEach(song => {
            const card = document.createElement("div");
            card.className = 'tarjeta-cancion';
            
            card.innerHTML = `
                <h3>${song.titulo} - ${song.nombre_artista}</h3>
                <img src="${song.imagen}" alt="${song.titulo}" width="100">
                <button class="ver-resenas" data-song-id="${song.id}">Ver Reseñas</button>
                <button class="add-playlist" data-song-id="${song.id}">Añadir a playlist</button>
            `;
            container.appendChild(card);
        });

        container.querySelectorAll('.add-playlist').forEach(button => {
            button.addEventListener('click', (e) => {
                const songId = (e.target as HTMLElement).dataset.songId;
                if (songId) {
                    const playlistId = prompt("¿A qué ID de playlist quieres agregarla?");
                    if (playlistId) {
                        this.songService.addToPlaylist(parseInt(songId), parseInt(playlistId));
                    }
                }
            });
        });
    }
}

window.addEventListener("DOMContentLoaded", () => new SongPage().init());