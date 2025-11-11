class AuthService {
    private loginUrl = '/api/login/';
    private registerUrl = '/api/register/';

    async login(username: string, password: string): Promise<boolean> {
        const res = await fetch(this.loginUrl, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: { "Content-Type": "application/json" }
        });
        return res.ok;
    }

    async register(data: { username: string; password: string; email: string }): Promise<boolean> {
        const res = await fetch(this.registerUrl, {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });
        return res.ok;
    }
}

// Manejadores de eventos (ejemplo para registro.html):
document.querySelector(".registro-boton")?.addEventListener("click", async () => {
    const username = (document.querySelector("#username") as HTMLInputElement).value;
    const email = (document.querySelector("#email") as HTMLInputElement).value;
    const pass = (document.querySelector("#pass") as HTMLInputElement).value;
    const service = new AuthService();
    await service.register({ username, password: pass, email });
});