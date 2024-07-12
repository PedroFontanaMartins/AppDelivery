function register() {
    const fullName = document.getElementById('fullName').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;

    fetch('https://localhost:7212/Login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            FullName: fullName,
            LoginName: username,
            Password: password
        })
    })
    .then(response => {
        if (response.status === 200) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'login.html';
        } else {
            return response.json().then(err => { throw new Error(err); });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Ocorreu um erro. Tente novamente mais tarde.');
    });
}