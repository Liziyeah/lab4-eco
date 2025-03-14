document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('register-button');
    const loginButton = document.getElementById('login-button');
    
    // Añadir efectos de hover para los botones
    function addButtonEffects(button) {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = button.id === 'register-button' ? 
                '0 7px 20px rgba(106, 17, 203, 0.6)' : 
                '0 7px 20px rgba(106, 17, 203, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
            button.style.boxShadow = button.id === 'register-button' ? 
                '0 4px 15px rgba(106, 17, 203, 0.4)' : 
                '0 4px 15px rgba(106, 17, 203, 0.15)';
        });
    }
    
    addButtonEffects(registerButton);
    addButtonEffects(loginButton);
    
    // Añadir efectos de click
    function addClickEffect(button) {
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(1px)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-2px)';
        });
    }
    
    addClickEffect(registerButton);
    addClickEffect(loginButton);
    
    // Redireccionar a páginas de registro y login
    registerButton.addEventListener('click', goToRegister);
    loginButton.addEventListener('click', goToLogin);
    
    // Comprobar si ya hay una sesión iniciada
    checkLoggedInStatus();
    
    function goToRegister(event) {
        event.preventDefault();
        registerButton.style.opacity = '0.8';
        registerButton.innerHTML = 'Redirigiendo...';
        setTimeout(() => {
            window.location.href = 'http://localhost:8080/auth/register';
        }, 300);
    }
    
    function goToLogin(event) {
        event.preventDefault();
        loginButton.style.opacity = '0.8';
        loginButton.innerHTML = 'Redirigiendo...';
        setTimeout(() => {
            window.location.href = 'http://localhost:8080/auth/login';
        }, 300);
    }
    
    function checkLoggedInStatus() {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            // Mostrar mensaje de bienvenida
            const container = document.querySelector('.container-dashboard');
            const form = document.querySelector('form');
            
            // Crear un botón de continuar
            form.innerHTML = `
                <p style="font-size: 1rem; color: #666; margin-bottom: 1rem;">¡Bienvenido de nuevo!</p>
                <button type="button" id="continue-button">Continuar navegando</button>
                <div class="divider">o</div>
                <button type="button" id="logout-button" style="background: white; color: #ef4444; border: 2px solid #ef4444; box-shadow: 0 4px 15px rgba(239, 68, 68, 0.15);">Cerrar sesión</button>
            `;

            document.getElementById('continue-button').addEventListener('click', () => {
                window.location.href = 'http://localhost:8080/view';
            });
            
            document.getElementById('logout-button').addEventListener('click', () => {
                localStorage.removeItem('loggedInUser');
                window.location.reload();
            });
            
            addButtonEffects(document.getElementById('continue-button'));
            addButtonEffects(document.getElementById('logout-button'));
            addClickEffect(document.getElementById('continue-button'));
            addClickEffect(document.getElementById('logout-button'));
        }
    }
});