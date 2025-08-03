/* ====================================================================== */
/*  CONFIG GLOBALE                                                        */
/* ====================================================================== */

/* Point d’entrée de ton backend. Change seulement cette ligne si besoin. */
const API_BASE = 'http://127.0.0.1:5000';

/* ====================================================================== */
/*  LOGIQUE COMMUNE (cookies, helpers…)                                   */
/* ====================================================================== */

/* Lire la valeur d’un cookie */
function getCookie (name) {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(name + '='))       // "token=xxxx"
    ?.split('=')[1]                                // -> "xxxx"
}

/* Petites utilités DOM */
function h (tag, cls = '', txt = '') {
  const el = document.createElement(tag)
  if (cls) el.className = cls
  if (txt) el.textContent = txt
  return el
}
function ul (items, cls = '') {
  const list = h('ul', cls)
  items.forEach(i => list.appendChild(h('li', '', i)))
  return list
}

/* ====================================================================== */
/*  BOOTSTRAP PAR PAGE                                                    */
/* ====================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname

  /* -------------------- page LOGIN ------------------------------------ */
  if (path.endsWith('login.html')) initLoginPage()

  /* -------------------- page INDEX ------------------------------------ */
  if (path.endsWith('index.html') || path.endsWith('/')) initIndexPage()

  /* -------------------- page PLACE ------------------------------------ */
  if (path.endsWith('place.html')) initPlacePage()
})

/* ====================================================================== */
/*  1) LOGIN PAGE                                                         */
/* ====================================================================== */

function initLoginPage () {
  const form = document.querySelector('form')
  if (!form) return

  form.addEventListener('submit', async e => {
    e.preventDefault()

    const email = document.querySelector('#email').value
    const password = document.querySelector('#password').value

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        /* Persiste le JWT et redirige vers la home */
        document.cookie = `token=${data.access_token}; path=/`
        window.location.href = 'index.html'
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Erreur de connexion au serveur')
    }
  })
}

/* ====================================================================== */
/*  2) INDEX PAGE (liste & filtre)                                        */
/* ====================================================================== */

function initIndexPage () {
  const token = getCookie('token')
  const loginLink = document.getElementById('login-link')
  if (loginLink) loginLink.style.display = token ? 'none' : 'block'

  fetchPlaces(token)                                   /* charge la liste */

  /* Filtre par prix */
  document.getElementById('price-filter')?.addEventListener('change', e => {
    const threshold = e.target.value
    document.querySelectorAll('.place-card').forEach(card => {
      const price = parseFloat(card.dataset.price)
      card.style.display =
        threshold === 'All' || price <= parseFloat(threshold) ? 'block' : 'none'
    })
  })
}

/* Récupère toutes les places (avec JWT si dispo) */
async function fetchPlaces (token) {
  try {
    const res = await fetch(`${API_BASE}/api/places`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    if (!res.ok) throw new Error('Erreur lors du chargement des places')
    const data = await res.json()
    displayPlaces(data)
  } catch (err) {
    console.error(err)
  }
}

/* Affiche la liste et rend chaque nom cliquable vers place.html */
function displayPlaces (places) {
  const list = document.getElementById('places-list')
  if (!list) return

  list.innerHTML = ''

  places.forEach(p => {
    const card = h('div', 'place-card')
    card.dataset.price = p.price                      /* pour le filtre */

    card.innerHTML = `
      <h3><a href="place.html?place_id=${p.id}">${p.name}</a></h3>
      <p>${p.description}</p>
      <p>Location: ${p.location}</p>
      <p>Price: $${p.price}</p>
    `
    list.appendChild(card)
  })
}

/* ====================================================================== */
/*  3) PLACE PAGE (détails + review form)                                 */
/* ====================================================================== */

function initPlacePage () {
  const placeId = new URLSearchParams(window.location.search).get('place_id')
  if (!placeId) {
    document.getElementById('place-details').textContent =
      'Aucun identifiant de place fourni.'
    return
  }

  const token = getCookie('token')
  toggleReviewForm(!!token)

  fetchPlaceDetails(placeId, token)
    .then(displayPlaceDetails)
    .catch(err => {
      console.error(err)
      document.getElementById('place-details')
        .textContent = 'Erreur lors du chargement des détails 😢'
    })
}

/* Masquer / montrer #add-review selon la connexion */
function toggleReviewForm (logged) {
  const section = document.getElementById('add-review')
  if (!section) return
  section.style.display = logged ? 'block' : 'none'
}

/* Requête GET /api/places/<id> (+ JWT si dispo) */
async function fetchPlaceDetails (placeId, token) {
  const res = await fetch(`${API_BASE}/api/places/${placeId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

/* Construit dynamiquement le DOM des détails */
function displayPlaceDetails (p) {
  const c = document.getElementById('place-details')
  if (!c) return
  c.innerHTML = ''                       /* purge l’ancien contenu */

  /* ---- bloc principal ---- */
  c.append(
    h('h2', 'text-2xl font-bold mb-2', p.name),
    h('p', 'text-lg mb-4', `Prix : $${p.price} / nuit`),
    h('p', 'mb-6', p.description)
  )

  /* ---- équipements ---- */
  c.append(
    h('h3', 'font-semibold mb-2', 'Équipements'),
    p.amenities.length
      ? ul(p.amenities, 'list-disc ml-6 mb-6')
      : h('p', 'italic mb-6', 'Aucun équipement renseigné')
  )

  /* ---- reviews ---- */
  c.append(
    h('h3', 'font-semibold mb-2', `Avis (${p.reviews.length})`),
    p.reviews.length
      ? ul(
          p.reviews.map(r =>
            `${r.user.first_name} : ${r.text} (${r.created_at.slice(0, 10)})`
          ),
          'list-disc ml-6'
        )
      : h('p', 'italic', 'Pas encore de review')
  )
}