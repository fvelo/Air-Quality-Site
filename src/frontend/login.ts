const btnLogin = document.getElementById('login-button') as HTMLButtonElement;
const usernameElement = document.getElementById('username') as HTMLInputElement;
const passwordElement = document.getElementById('password') as HTMLInputElement;

// 
// CONST
// 

const api = {
    login: '/api/v0/auth/login',
    sessionData: '/api/v0/session-data',
}

document.addEventListener('DOMContentLoaded', async () => {
    await isAuthenticated();
});

btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const username: string = usernameElement.value.trim();
    const password: string = passwordElement.value;
    passwordElement.value = '';
    // console.log(`Email: ${email}, Password: ${password}`);
    try {
        const reqConfig = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        }

        const res = await fetch(api.login, reqConfig);

        if (!res.ok) {
            let resJson = await res.json();
            throw new Error(resJson.message);
        }

        window.location.href = '/';
    } catch (error: any) {
        alert(error.message || 'Login failed');
    }
});


async function isAuthenticated() {
    try {
        const res = await fetch(api.sessionData);
        if (!res.ok) throw new Error();
        const { isAuth } = await res.json();
        if (isAuth) {
            window.location.href = '/account';
        }
    } catch {
        window.location.reload();
    }
}

export = {}; // I have done this so typescript treat this file like a module and don't gobalize every variable