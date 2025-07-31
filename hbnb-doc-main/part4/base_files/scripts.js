/* 
  This is a SAMPLE FILE to get you started.
  Please, follow the project instructions to complete the tasks.
*/

  document.addEventListener('DOMContentLoaded', () => {
    // Vérifie si on est sur index.html
    if (window.location.pathname.endsWith('index.html')) {
        const token = getCookie('token');
        if (!token) {
            window.location.href = 'login.html';
        }
    }
});

// Fonction pour récupérer un cookie
function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split('=');
        if (key === name) {
            return value;
        }
    }
    return null;
}
document.addEventListener('DOMContentLoaded', () => {
  // Si on est sur login.html
  if (window.location.pathname.endsWith('login.html')) {
    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      try {
        const response = await fetch('http://127.0.0.1:5000/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          document.cookie = `token=${data.access_token}; path=/`;
          window.location.href = 'index.html';
        } else {
          alert(data.error || 'Login failed');
        }
      } catch (err) {
        alert('Erreur de connexion au serveur');
        console.error(err);
      }
    });
  }
});
