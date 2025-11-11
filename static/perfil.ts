
// 1. Define la IP de tu backend
 export const API_BASE_URL = 'http://127.0.0.1:8000';

class User {
    constructor(
        public id: number,
        public username: string,
        // ¡OJO! Tu backend devuelve 'first_name', no 'name'
        public first_name: string,
        public last_name: string,
        public email: string
    ) { }
}

class UserService {
    // 2. URL Corregida (¡ya coincide con nuestro backend!)
    private apiUrl = `${API_BASE_URL}/api/profile/`;

    /**
     * Busca el perfil del usuario.
     * ¡Debe enviar el Token!
     */
    async fetchProfile(): Promise<User | null> {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("No hay token, redirigiendo al login");
            window.location.href = 'index.html'; // No puedes estar aquí sin token
            return null;
        }

        try {
            const res = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 3. ¡LA AUTENTICACIÓN!
                    'Authorization': `Token ${token}`
                }
            });

            if (!res.ok) {
                console.error("Error al cargar el perfil, token inválido?");
                window.location.href = 'index.html'; // Token malo, al login
                return null;
            }

            return res.json();
        } catch (err) {
            console.error('Error en fetch de perfil:', err);
            return null;
        }
    }

    /**
     * Edita el perfil.
     * ¡OJO! Nuestro backend (de momento) no tiene un endpoint para 'PUT' o 'EDITAR'
     * el perfil. Solo para 'GET' (ver) y 'POST' (crear).
     * Esta función no funcionará hasta que la creemos en el backend.
     */
    async editProfile(data: Partial<User>) {
        const token = localStorage.getItem('authToken');
        console.warn("ADVERTENCIA: La API para 'editProfile' (PUT /api/profile/) no está construida en el backend todavía.");
        
        // --- CÓDIGO FUTURO (cuando creemos el PUT en Django) ---
        /*
        await fetch(this.apiUrl, {
            method: "PUT", // O 'PATCH'
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
        const editBtn = document.querySelector(".botonEditar"); // Asumiendo que tienes un botón con esta clase
        editBtn?.addEventListener("click", () => this.editProfile());
        
        await this.renderProfile();
    }

    async renderProfile() {
        const user = await this.userService.fetchProfile();
        if (!user) return; // Si el fetch falló (ej. no hay token), no hacer nada

        // Usamos los campos correctos del backend: 'first_name' y 'last_name'
        const nombreCompleto = `${user.first_name} ${user.last_name}`;

        // Asignamos a los <p> de tu 'perfil.html'
        // ¡Asegúrate de que tu HTML tenga estas clases!
        (document.querySelector(".nombre") as HTMLElement).textContent = nombreCompleto.trim() ? nombreCompleto : "Sin nombre";
        (document.querySelector(".usuario") as HTMLElement).textContent = user.username;
        (document.querySelector(".correo") as HTMLElement).textContent = user.email;
    }

    async editProfile() {
        // Esta función está "en pausa" hasta que creemos el endpoint de 'PUT'
        const nombre = prompt("Nuevo nombre (first_name):");
        if (nombre) await this.userService.editProfile({ first_name: nombre });
        
        await this.renderProfile();
    }
}

window.addEventListener("DOMContentLoaded", () => new ProfilePage().init());