class Announcement {
    constructor(
        public id: number,
        public title: string,
        public content: string
    ) { }
}

class AnnouncementService {
    private apiUrl = '/api/anuncios/';

    async fetchAnnouncements(): Promise<Announcement[]> {
        const res = await fetch(this.apiUrl);
        return res.json();
    }
}

class HomePage {
    private service = new AnnouncementService();

    async init() {
        await this.renderAnnouncements();
    }

    async renderAnnouncements() {
        const container = document.querySelector(".anuncios-list");
        const anuncios = await this.service.fetchAnnouncements();
        if (!container) return;
        container.innerHTML = '';
        anuncios.forEach(a =>
            container.innerHTML += `<div><h4>${a.title}</h4><p>${a.content}</p></div>`
        );
    }
}

window.addEventListener("DOMContentLoaded", () => new HomePage().init());