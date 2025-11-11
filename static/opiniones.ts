class Opinion {
    constructor(
        public id: number,
        public user: string,
        public content: string
    ) { }
}

class OpinionService {
    private apiUrl = '/api/opiniones/';

    async fetchOpinions(): Promise<Opinion[]> {
        const res = await fetch(this.apiUrl);
        return res.json();
    }

    async publishOpinion(content: string): Promise<void> {
        await fetch(this.apiUrl, {
            method: "POST",
            body: JSON.stringify({ content }),
            headers: { "Content-Type": "application/json" }
        });
    }
}

class OpinionPage {
    private service = new OpinionService();

    async init() {
        const publishBtn = document.querySelector(".botonPublicar");
        publishBtn?.addEventListener("click", async () => {
            const textarea = document.querySelector<HTMLTextAreaElement>("textarea");
            if (textarea?.value) await this.service.publishOpinion(textarea.value);
            await this.renderOpinions();
        });
        await this.renderOpinions();
    }

    async renderOpinions() {
        const container = document.querySelector(".opiniones-list");
        const opinions = await this.service.fetchOpinions();
        if (!container) return;
        container.innerHTML = '';
        opinions.forEach(o =>
            container.innerHTML += `<div><strong>${o.user}</strong>: ${o.content}</div>`
        );
    }
}

window.addEventListener("DOMContentLoaded", () => new OpinionPage().init());