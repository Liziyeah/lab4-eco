document.addEventListener("DOMContentLoaded", () => {
    const resultado = document.getElementById("resultado"); 
    const resultadoPosts = document.getElementById("resultado-posts"); 
    const btnUsuarios = document.getElementById("btnUsuarios"); 
    const btnPublicaciones = document.getElementById("btnPublicaciones"); 

    if (!resultado || !resultadoPosts || !btnUsuarios || !btnPublicaciones) {
        console.error("Error: No se encontraron los elementos en el DOM."); 
        return;
    }

    // Función para mostrar los estados de carga
    function showLoading(element, message = "Cargando...") {
        element.innerHTML = `<div class="empty-state">${message}</div>`;
    }

    // Función para mostrar errores
    function showError(element, message = "Error al cargar los datos.") {
        element.innerHTML = `<div class="empty-state">${message}</div>`;
    }
    
    btnUsuarios.addEventListener("click", async () => {
        // Mostrar estado de carga
        showLoading(resultado);
        
        try {
            const response = await fetch("http://localhost:8080/api/users");
            if (!response.ok) throw new Error("Error al obtener los usuarios."); 

            const users = await response.json();

            if (users.length === 0) {
                resultado.innerHTML = `<div class="empty-state">No hay usuarios registrados.</div>`;
                return;
            }

            resultado.innerHTML = users.map(user => `
                <div class="user-item">
                    <strong>${user.name}</strong>
                    <span>@${user.username}</span>
                </div>
            `).join("");

        } catch (error) {
            console.error("Error al obtener usuarios:", error); 
            showError(resultado, "No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.");
        }
    });

    btnPublicaciones.addEventListener("click", async () => {
        // Mostrar estado de carga
        showLoading(resultadoPosts);
        
        try {
            const response = await fetch("http://localhost:8080/api/posts");
            if (!response.ok) throw new Error("Error al obtener las publicaciones.");

            const posts = await response.json(); 

            if (posts.length === 0) {
                resultadoPosts.innerHTML = `<div class="empty-state">No hay publicaciones disponibles.</div>`;
                return;
            }

            resultadoPosts.innerHTML = posts.map(post => `
                <div class="post">
                    <h3>${post.title}</h3>
                    <p><strong>Autor:</strong> ${post.name} (@${post.username})</p>
                    <p>${post.description}</p>
                    <img src="${post.url}" class="post-image" alt="Imagen de la publicación">
                </div>`).join("");

        } catch (error) {
            console.error("Error al obtener publicaciones:", error); 
            showError(resultadoPosts, "No se pudieron cargar las publicaciones. Inténtalo de nuevo más tarde.");
        }
    });

    // Inicialmente mostrar mensajes de estado vacío
    resultado.innerHTML = `<div class="empty-state">Haz clic en "Ver Usuarios" para mostrar los usuarios registrados.</div>`;
    resultadoPosts.innerHTML = `<div class="empty-state">Haz clic en "Ver Publicaciones" para mostrar las publicaciones.</div>`;
});