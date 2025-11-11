class Playlist {
    constructor(
        public id: number,
        public name: string,
        public songsCount: number
    ) { }
}

class PlaylistService {
    private apiUrl = '/api/playlists/';

    async fetchPlaylists(): Promise<Playlist[]> {
        const res = await fetch(this.apiUrl);
        return res.json();
    }

    async createPlaylist(name: string): Promise<void> {
        await fetch(this.apiUrl, {
            method: "POST",
            body: JSON.stringify({ name }),
            headers: { "Content-Type": "application/json" }
        });
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
        const playlists = await this.service.fetchPlaylists();
        if (!container) return;
        container.innerHTML = '';
        playlists.forEach(p =>
            container.innerHTML += `<div><h3>${p.name}</h3><p>${p.songsCount} canciones</p></div>`
        );
    }
}

window.addEventListener("DOMContentLoaded", () => new PlaylistPage().init());