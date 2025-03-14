document.addEventListener('DOMContentLoaded', () => {
	const form = document.getElementById('form-user');

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const username = document.getElementById('user').value.trim();
		const name = document.getElementById('name').value.trim();
		const password = document
			.getElementById('register-password')
			.value.trim();

		if (!username || !name || !password) {
			alert('Campos obligatorios.');
			return;
		}

		try {
			const result = await fetch(
				'http://localhost:8080/api/auth/register',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ username, name, password }),
				}
			);

			const response = await result.json();

			if (result.ok) {
				alert('Se ha registrado exitosamente.');
				window.location.href = 'http://localhost:8080/auth/login';
			} else {
				alert(response.message || 'Error al registrar.');
			}
		} catch (error) {
			console.error('Error de registro', error);
			alert('Error del servidor.');
		}
	});
});
