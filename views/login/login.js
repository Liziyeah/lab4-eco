const formLogin = document.getElementById('login-user');

formLogin.addEventListener('submit', async (event) => {
	event.preventDefault();

	const username = document.getElementById('username').value.trim();
	const password = document.getElementById('user-password').value.trim();

	if (!username || !password) {
		alert('Campos obligatorios.');
		return;
	}

	try {
		const result = await fetch('http://localhost:8080/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, password }),
		});

		const response = await result.json();

		if (result.ok) {
			localStorage.setItem('loggedInUser', JSON.stringify(response));
			alert('Bienvenido');
			window.location.href = 'http://localhost:8080/posts/create';
		} else {
			alert(response.message || 'Datos incorrectos.');
		}
	} catch (error) {
		console.log('Error al iniciar sesión', error);
		alert('Error con el servidor.');
	}
});
