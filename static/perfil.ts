export const API_BASE_URL = 'http://127.0.0.1:8000';

class User {
    constructor(
        public id: number,
        public username: string,
        public first_name: string,
        public last_name: string,
        public email: string
    ) { }
}

class UserService {
    private apiUrl = `${API_BASE_URL}/api/profile/`;

    async fetchProfile(): Promise<User | null> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html';
            return null;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });

            if (!res.ok) {
                console.error("Error al cargar el perfil, token inválido?");
                window.location.href = 'index.html';
                return null;
            }

            return res.json();
        } catch (err) {
            console.error('Error en fetch de perfil:', err);
            return null;
        }
    }

    async editProfile(data: Partial<User>) {
        const token = localStorage.getItem('authToken');
        console.warn("ADVERTENCIA: La API para 'editProfile' (PUT /api/profile/) no está construida en el backend todavía.");
        /*
        await fetch(this.apiUrl, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Token ${token}`
            }
        });
        */
    }
}

class ProfilePage {
    private userService = new UserService();

    async init() {
        const editBtn = document.querySelector(".botonEditar");
        editBtn?.addEventListener("click", () => this.editProfile());
        
        await this.renderProfile();
    }

    async renderProfile() {
        const user = await this.userService.fetchProfile();
        if (!user) return;

        const nombreCompleto = `${user.first_name} ${user.last_name}`;

        (document.querySelector(".nombre") as HTMLElement).textContent = nombreCompleto.trim() ? nombreCompleto : "Sin nombre";
        (document.querySelector(".usuario") as HTMLElement).textContent = user.username;
        (document.querySelector(".correo") as HTMLElement).textContent = user.email;
    }

    async editProfile() {
        const nombre = prompt("Nuevo nombre (first_name):");
        if (nombre) await this.userService.editProfile({ first_name: nombre });
        
        await this.renderProfile();
    }
}

window.addEventListener("DOMContentLoaded", () => new ProfilePage().init());