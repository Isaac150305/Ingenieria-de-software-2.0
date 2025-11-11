class Song {
    constructor(
        public id: number,
        public title: string,
        public artist: string
    ) { }
}

class SongService {
    private apiUrl = '/api/songs/';

    async fetchSongs(query: string = ""): Promise<Song[]> {
        const res = await fetch(`${this.apiUrl}?search=${encodeURIComponent(query)}`);
        return res.json();
    }

    async addToPlaylist(songId: number, playlistId: number): Promise<void> {
        await fetch(`/api/playlists/${playlistId}/add-song/`, {
            method: "POST",
            body: JSON.stringify({ song_id: songId }),
            headers: { "Content-Type": "application/json" }
        });
    }
}

class SongPage {
    private songService = new SongService();

    async init() {
        const searchInput = document.querySelector<HTMLInputElement>("input[type=text]");
        const container = document.querySelector(".catalogo-canciones");
        searchInput?.addEventListener("input", async () => {
            const songs = await this.songService.fetchSongs(searchInput.value);
            this.renderSongs(songs, container);
        });
    }

    renderSongs(songs: Song[], container: Element | null) {
        if (!container) return;
        container.innerHTML = '';
        songs.forEach(song => {
            const card = document.createElement("div");
            card.innerHTML = `
                <h3>${song.title} - ${song.artist}</h3>
                <button class="ver">Ver</button>
                <button class="add-playlist">Añadir a playlist</button>
            `;
            container.appendChild(card);
        });
    }
}

// Al cargar la página
window.addEventListener("DOMContentLoaded", () => new SongPage().init());