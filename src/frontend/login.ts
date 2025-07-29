const btnLogin = document.getElementById('login-button') as HTMLButtonElement;
const usernameElement = document.getElementById('username') as HTMLInputElement;
const passwordElement = document.getElementById('password') as HTMLInputElement;

// 
// CONST
// 

const apiEndpoint = {
    login: '/api/v0/auth/login',
}

btnLogin.addEventListener('click', async function(e) {
    e.preventDefault();
    const username: string | null = usernameElement.value;
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

export = {}; // I have done this so typescript treat this file like a module and don't gobalize every variable