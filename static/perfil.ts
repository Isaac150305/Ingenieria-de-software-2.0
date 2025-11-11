class User {
    constructor(
        public id: number,
        public username: string,
        public name: string,
        public email: string
    ) { }
}

class UserService {
    private apiUrl = '/api/profile/';

    async fetchProfile(): Promise<User> {
        const res = await fetch(this.apiUrl);
        return res.json();
    }

    async editProfile(data: Partial<User>) {
        await fetch(this.apiUrl, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });
    }
}

class ProfilePage {
    private userService = new UserService();

    async init() {
        const editBtn = document.querySelector(".botonEditar");
        editBtn?.addEventListener("click", () => this.editProfile());
        this.renderProfile();
    }

    async renderProfile() {
        const user = await this.userService.fetchProfile();
        document.querySelector(".nombre")!.textContent = user.name;
        document.querySelector(".usuario")!.textContent = user.username;
        document.querySelector(".correo")!.textContent = user.email;
    }

    async editProfile() {
        const name = prompt("Nuevo nombre:");
        if (name) await this.userService.editProfile({ name });
        await this.renderProfile();
    }
}

window.addEventListener("DOMContentLoaded", () => new ProfilePage().init());