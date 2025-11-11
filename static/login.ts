// ==========================================================
// static/login.ts (¡El Código Corregido!)
// ==========================================================

// 1. Define la IP y puerto de tu backend
const API_BASE_URL = 'http://127.0.0.1:8000';

// ==========================================================
// CLASE DE SERVICIO DE AUTENTICACIÓN
// (Arregla el Error 1 y 2)
// ==========================================================
class AuthService {
    
    // --- ¡CORREGIDO! ---
    // Estas son las URLs reales de nuestro backend de Django
    private loginUrl = `${API_BASE_URL}/api/usuarios/login/`;
    private registerUrl = `${API_BASE_URL}/api/usuarios/register/`;

    /**
     * Intenta iniciar sesión.
     * Si tiene éxito, GUARDA EL TOKEN y devuelve true.
     * Si falla, devuelve false.
     */
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

            // --- ¡LA PARTE MÁS IMPORTANTE! ---
            // Leemos el JSON y guardamos el token
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('authToken', data.token); // Guardado
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

    /**
     * Intenta registrar un nuevo usuario.
     */
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
                // Si falla, lee el error del backend
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


// ==========================================================
// MANEJADORES DE EVENTOS
// (Arregla el Error 3 y 4)
// ==========================================================

const service = new AuthService();

// --- Manejador para la página de REGISTRO (registro.html) ---
// Busca el botón con la clase 'registro-boton' (en tu HTML es 'boton' genérico)
// ¡Asegúrate de que tu botón de registro tenga una clase o ID único!
// Por ejemplo: <button class="boton" id="btn-registrar">Registrar</button>
const btnRegistro = document.querySelector("#btn-registrar"); // <-- ¡Usa un ID!

if (btnRegistro) {
    btnRegistro.addEventListener("click", async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página
        
        console.log("Botón de registro clickeado");

        // Usamos los IDs CORRECTOS de registro.html
        const nombreCompleto = (document.querySelector("#nombre") as HTMLInputElement).value;
        const username = (document.querySelector("#usuario") as HTMLInputElement).value;
        const email = (document.querySelector("#correo") as HTMLInputElement).value;
        const password = (document.querySelector("#clave") as HTMLInputElement).value;

        // Dividimos el nombre para nuestro backend
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
            // Redirigimos al login
            window.location.href = 'index.html';
        } else {
            alert("Error en el registro. Revisa la consola.");
        }
    });
}


// --- Manejador para la página de LOGIN (index.html) ---
// ¡Asegúrate de que tu botón de login tenga un ID único!
// Por ejemplo: <button class="boton" id="btn-login">Entrar</button>
const btnLogin = document.querySelector("#btn-login"); // <-- ¡Usa un ID!

if (btnLogin) {
    btnLogin.addEventListener("click", async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página

        console.log("Botón de login clickeado");

        // Usamos los IDs CORRECTOS de index.html
        // ¡OJO! Tu index.html usa "correo" pero el backend pide "username"
        // Debes decidir: o el usuario hace login con email (y cambiamos el backend)
        // o hace login con username (y cambias el HTML).
        
        // Asumamos que el login es con USERNAME (apodo)
        // DEBES cambiar tu index.html para que pida "Nombre de usuario"
        const username = (document.querySelector("#usuario_login") as HTMLInputElement).value; // <-- Asumiendo ID 'usuario_login'
        const password = (document.querySelector("#clave_login") as HTMLInputElement).value; // <-- Asumiendo ID 'clave_login'

        const exito = await service.login(username, password);

        if (exito) {
            alert("¡Login exitoso!");
            // Redirigimos a la página de inicio
            window.location.href = 'inicio.html';
        } else {
            alert("Login fallido. Usuario o contraseña incorrectos.");
        }
    });
}