document.addEventListener("DOMContentLoaded", () => {
    const formPost = document.getElementById("create-post");
    const urlInput = document.getElementById("url");
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description-post");
    const submitButton = document.getElementById("button-create");

    // Función para mostrar mensajes de alerta estilizados
    function showAlert(message, type = 'error') {
        // Eliminar alertas anteriores
        const existingAlerts = document.querySelectorAll('.alert-message');
        existingAlerts.forEach(alert => alert.remove());
        
        // Crear alerta nueva
        const alert = document.createElement('div');
        alert.className = `alert-message ${type}`;
        alert.textContent = message;
        alert.style.position = 'fixed';
        alert.style.top = '20px';
        alert.style.left = '50%';
        alert.style.transform = 'translateX(-50%)';
        alert.style.padding = '12px 20px';
        alert.style.borderRadius = '50px';
        alert.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
        alert.style.color = 'white';
        alert.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
        alert.style.zIndex = '1000';
        alert.style.fontWeight = '500';
        alert.style.minWidth = '250px';
        alert.style.textAlign = 'center';
        
        document.body.appendChild(alert);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            alert.style.opacity = '0';
            alert.style.transition = 'opacity 0.5s ease';
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }

    // Función para habilitar/deshabilitar el botón según validación
    function validateForm() {
        const isValid = urlInput.value.trim() && titleInput.value.trim() && descriptionInput.value.trim();
        submitButton.disabled = !isValid;
        submitButton.style.opacity = isValid ? '1' : '0.7';
        submitButton.style.cursor = isValid ? 'pointer' : 'not-allowed';
    }

    // Aplicar validación en tiempo real
    [urlInput, titleInput, descriptionInput].forEach(input => {
        input.addEventListener('input', validateForm);
    });

    // Manejar la validación de URL
    urlInput.addEventListener('blur', () => {
        const url = urlInput.value.trim();
        if (url && !url.match(/^(http|https):\/\/[^ "]+$/)) {
            urlInput.style.borderColor = '#ef4444';
            showAlert('Por favor, ingresa una URL válida');
        } else if (url) {
            urlInput.style.borderColor = '#10b981';
        }
    });

    // Manejar el envío del formulario
    formPost.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        // Cambiar el botón a estado de carga
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Publicando...';
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';

        const url = urlInput.value.trim();
        const title = titleInput.value.trim(); 
        const description = descriptionInput.value.trim(); 

        if (!url || !title || !description) {
            showAlert("Todos los campos son obligatorios.");
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            return; 
        }

        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (!loggedInUser) {
            showAlert("Debes iniciar sesión para crear una publicación.");
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            return;
        }

        try {
            const result = await fetch("http://localhost:8080/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: loggedInUser.username,
                    name: loggedInUser.name,
                    url,
                    title,
                    description
                })
            });

            const response = await result.json();

            if (result.ok) {
                showAlert("¡Publicación creada exitosamente!", "success");
                formPost.reset();
            } else {
                showAlert(response.message || "No se pudo publicar. Intenta de nuevo.");
            }
        } catch (error) {
            console.error("Error al crear la publicación:", error);
            showAlert("Error de conexión. Verifica tu conexión a internet.");
        } finally {
            // Restaurar el botón
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
        }
    });

    // Inicializar validación
    validateForm();
});