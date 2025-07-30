const btnLogin = document.getElementById('login-button') as HTMLButtonElement;
const usernameElement = document.getElementById('username') as HTMLInputElement;
const passwordElement = document.getElementById('password') as HTMLInputElement;

// 
// CONST
// 

const apiEndpoint = {
    login: '/api/v0/auth/login',
    sessionData: '/api/v0/auth/me',
}

document.addEventListener('DOMContentLoaded', async () => {
    await isAuthenticated();
});

btnLogin.addEventListener('click', async (e) => {
    e.preventDefault();
    const username: string = usernameElement.value.trim();
    const password: string = passwordElement.value;
    // console.log(`Email: ${email}, Password: ${password}`);
    try {
        const reqConfig = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({username, password})
        }
        const res = await fetch(apiEndpoint.login, reqConfig);
        if (!res.ok) throw new Error('Invalid credentials');
        const { token } = await res.json();
        localStorage.setItem('authToken', token);
        window.location.href = '/';
    } catch(err: any) {
        alert(err.message || 'Login failed');
    }
});


async function isAuthenticated() {
    const nav = document.querySelector('.user-menu') as HTMLDivElement;
    try {
        const res = await fetch(apiEndpoint.sessionData);
        if (!res.ok) throw new Error();
        const { isAuth, user } = await res.json();
        if (isAuth) {
            window.location.href = '/account';
        }
    } catch {
        window.location.reload();
    }
}

export = {}; // I have done this so typescript treat this file like a module and don't gobalize every variable