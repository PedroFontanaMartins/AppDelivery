function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch(`https://localhost:7212/Login?loginName=${username}&password=${password}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.status === 200) {
            window.location.href = 'home.html';
        } else {
            console.error('Login falhou');
            alert('Login falhou. Verifique suas credenciais.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
}

function openRegister() {
    window.location.href = 'register.html';
}