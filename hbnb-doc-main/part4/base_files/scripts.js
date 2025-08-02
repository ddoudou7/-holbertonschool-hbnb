document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  if (path.endsWith('index.html')) {
    checkAuthentication();
  }

  if (path.endsWith('login.html')) {
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

function checkAuthentication() {
  const token = getCookie('token');
  const loginLink = document.getElementById('login-link');

  if (!token) {
    if (loginLink) loginLink.style.display = 'block';
  } else {
    if (loginLink) loginLink.style.display = 'none';
    fetchPlaces(token);
  }
}

async function fetchPlaces(token) {
  try {
    const response = await fetch('http://127.0.0.1:5000/api/places', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error('Erreur lors du chargement des places');

    const data = await response.json();
    displayPlaces(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function displayPlaces(places) {
  const placesList = document.getElementById('places-list');
  if (!placesList) return;

  placesList.innerHTML = '';

  places.forEach(place => {
    const placeDiv = document.createElement('div');
    placeDiv.className = 'place-card';
    placeDiv.setAttribute('data-price', place.price);

    placeDiv.innerHTML = `
      <h3>${place.name}</h3>
      <p>${place.description}</p>
      <p>Location: ${place.location}</p>
      <p>Price: $${place.price}</p>
    `;

    placesList.appendChild(placeDiv);
  });
}

document.getElementById('price-filter')?.addEventListener('change', (event) => {
  const selectedPrice = event.target.value;
  const placeCards = document.querySelectorAll('.place-card');

  placeCards.forEach(card => {
    const price = parseFloat(card.getAttribute('data-price'));
    if (selectedPrice === 'All' || price <= parseFloat(selectedPrice)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
});