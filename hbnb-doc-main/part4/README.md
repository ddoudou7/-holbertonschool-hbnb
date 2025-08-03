# HBnB Web Client – Part 4

A lightweight HTML / CSS / JavaScript (ES6) front-end that consumes a **mock Flask API** to list places, display detailed information, and let authenticated users post reviews.

---

## 📁 Project Tree

part4/
├─ base_files/
│ ├─ index.html # list of places + price filter
│ ├─ login.html # mock login form
│ ├─ place.html # place details + reviews
│ ├─ scripts.js # all front-end logic
│ └─ styles.css # optional basic styles
├─ mock_api.py # tiny Flask back-end (places, login, reviews)
└─ … # doc_images/, manual_review/, etc.

yaml
Copier
Modifier

---

## 🌐 Pages

| File            | Purpose |
|-----------------|---------|
| **index.html**  | Home page – shows every place, price filter. |
| **login.html**  | Simple auth – any *email = password* combo returns a fake JWT. |
| **place.html**  | Detailed view – name, price, description, amenities, reviews. If logged in, the “Add review” form is shown. |

---

## ⚙️ Tech Stack

* **HTML5 / CSS3**
* **JavaScript ES6** (Fetch API)
* **Flask** *(mock back-end only)*
* Zero build tools, zero external deps.

---

## 🔐 Authentication (mock)

* `POST /login` → `{ "access_token": "fake-jwt-token-123456" }`
* Token stored in **cookie** `token`.
* Presence of the cookie controls display of the *Add review* form.

---

## 🔄 Mock API Endpoints

| Verb | Route | Description |
|------|-------|-------------|
| `POST` | `/login` | Returns a fake JWT if `email == password`. |
| `GET`  | `/api/places` | All places. |
| `GET`  | `/api/places/<id>` | Full details, amenities, reviews. |
| `POST` | `/api/places/<id>/reviews` | Create a review (`Authorization: Bearer <token>`). |

---

## ▶️ Quick Start (30 s)

```bash
# 1) start the mock API
cd part4
python mock_api.py            # → http://127.0.0.1:5000

# 2) serve the front-end (second terminal)
cd base_files
python -m http.server 5500    # → http://127.0.0.1:5500
Walk-through:

Open http://127.0.0.1:5500/index.html

Click Login → enter any credentials

Back on the index page (Login link disappears)

Open a place → try Add review

CORS is handled via from flask_cors import CORS inside mock_api.py.

✅ Completed Features (Tasks 03 & 04)
Extract place_id from the URL.

Check JWT in cookies; hide or show the Add review form accordingly.

GET / POST calls send Authorization: Bearer <token> when present.

Instant review list update after successful POST.

👤 Author
Mr Philips
https://github.com/ddoudou7