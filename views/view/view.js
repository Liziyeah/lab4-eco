document.addEventListener("DOMContentLoaded", () => {
    const resultado = document.getElementById("resultado"); 
    const resultadoPosts = document.getElementById("resultado-posts"); 
    const btnUsuarios = document.getElementById("btnUsuarios"); 
    const btnPublicaciones = document.getElementById("btnPublicaciones"); 

    if (!resultado || !resultadoPosts || !btnUsuarios || !btnPublicaciones) {
        console.error("Error: No se encontraron los elementos en el DOM."); 
        return;
    }

    const socket = io("/", { path: "/real-time" });

    socket.on('connect', () => {
        console.log('Conectado al servidor Socket.IO');
    });
    socket.on('new-post', (post) => {
 
        mostrarNotificacion(`Nueva publicación de ${post.username}: ${post.title}`);

        if (resultadoPosts.querySelector('.post')) {
            agregarNuevaPublicacion(post);
        }
    });
    
    socket.on('new-user', (user) => {
        mostrarNotificacion(`Nuevo usuario registrado: ${user.username}`);
        
        if (resultado.querySelector('.user-item')) {
            agregarNuevoUsuario(user);
        }
    });

    const mostrarNotificacion = (mensaje) => {
        const notificacion = document.createElement('div');
        notificacion.className = 'notification';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notificacion.classList.remove('show');
            setTimeout(() => notificacion.remove(), 500);
        }, 5000);
    };
    

    const agregarNuevaPublicacion = (post) => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p><strong>Autor:</strong> ${post.name} (@${post.username})</p>
            <p>${post.description}</p>
            <img src="${post.url}" class="post-image" alt="Imagen de la publicación">
        `;
        

        postElement.classList.add('new-item');
        

        resultadoPosts.insertBefore(postElement, resultadoPosts.firstChild);
    
        setTimeout(() => {
            postElement.classList.remove('new-item');
        }, 1000);
    };
    
    const agregarNuevoUsuario = (user) => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <strong>${user.name}</strong>
            <span>@${user.username}</span>
        `;
    
        userElement.classList.add('new-item');

        resultado.insertBefore(userElement, resultado.firstChild);
        setTimeout(() => {
            userElement.classList.remove('new-item');
        }, 1000);
    };

    const mostrarCargando = (elemento, mensaje = "Cargando...") => {
        elemento.innerHTML = `<div class="empty-state">${mensaje}</div>`;
    };
    const mostrarError = (elemento, mensaje = "Error al cargar los datos.") => {
        elemento.innerHTML = `<div class="empty-state">${mensaje}</div>`;
    };
    
    btnUsuarios.addEventListener("click", async () => {
        mostrarCargando(resultado);
        
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
            mostrarError(resultado, "No se pudieron cargar los usuarios. Inténtalo de nuevo más tarde.");
        }
    });
    btnPublicaciones.addEventListener("click", async () => {
        mostrarCargando(resultadoPosts);
        
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
            mostrarError(resultadoPosts, "No se pudieron cargar las publicaciones. Inténtalo de nuevo más tarde.");
        }
    });
    resultado.innerHTML = `<div class="empty-state">Haz clic en "Ver Usuarios" para mostrar los usuarios registrados.</div>`;
    resultadoPosts.innerHTML = `<div class="empty-state">Haz clic en "Ver Publicaciones" para mostrar las publicaciones.</div>`;
});