const API_BASE_URL = 'http://127.0.0.1:8000';

class AuthService {
    private loginUrl = `${API_BASE_URL}/api/usuarios/login/`;
    private registerUrl = `${API_BASE_URL}/api/usuarios/register/`;

    async login(username: string, password: string): Promise<boolean> {
        try {
            const res = await fetch(this.loginUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                console.error('Respuesta de login no fue OK');
                return false;
            }

            const data = await res.json();
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                console.log('Login exitoso. Token guardado.');
                return true;
            } else {
                console.error('Login exitoso pero no se recibió token.');
                return false;
            }

        } catch (err) {
            console.error('Error en fetch de login:', err);
            return false;
        }
    }

    async register(data: { 
        username: string; 
        password: string; 
        email: string;
        first_name: string;
        last_name: string;
    }): Promise<boolean> {
        
        try {
            const res = await fetch(this.registerUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error('Error en el registro:', errorData);
                alert(`Error en el registro: ${JSON.stringify(errorData)}`);
            }
            
            return res.ok;
        } catch (err) {
            console.error('Error en fetch de registro:', err);
            return false;
        }
    }
}

const service = new AuthService();

const btnRegistro = document.querySelector("#btn-registrar");

if (btnRegistro) {
    btnRegistro.addEventListener("click", async (e) => {
        e.preventDefault();
        
        console.log("Botón de registro clickeado");

        const nombreCompleto = (document.querySelector("#nombre") as HTMLInputElement).value;
        const username = (document.querySelector("#usuario") as HTMLInputElement).value;
        const email = (document.querySelector("#correo") as HTMLInputElement).value;
        const password = (document.querySelector("#clave") as HTMLInputElement).value;

        const partesNombre = nombreCompleto.split(' ');
        const first_name = partesNombre[0] || '';
        const last_name = partesNombre.slice(1).join(' ') || '';

        const exito = await service.register({ 
            username, 
            password, 
            email, 
            first_name, 
            last_name 
        });

        if (exito) {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            window.location.href = 'index.html';
        } else {
            alert("Error en el registro. Revisa la consola.");
        }
    });
}

const btnLogin = document.querySelector("#btn-login");

if (btnLogin) {
    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault();

        console.log("Botón de login clickeado");

        const username = (document.querySelector("#usuario_login") as HTMLInputElement).value;
        const password = (document.querySelector("#clave_login") as HTMLInputElement).value;

        const exito = await service.login(username, password);

        if (exito) {
            alert("¡Login exitoso!");
            window.location.href = 'inicio.html';
        } else {
            alert("Login fallido. Usuario o contraseña incorrectos.");
        }
    });
}