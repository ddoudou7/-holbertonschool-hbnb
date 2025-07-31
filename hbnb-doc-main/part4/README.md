# HBNB Web Client – Part 4

This project is a simple **web front-end** built using **HTML5, CSS3, and JavaScript (ES6)** to interact with a Flask API.

## 📁 Folder Structure

part4/
├── base_files/
├── doc_images/
├── manual_review/
├── images/
├── index.html
├── login.html
├── place.html
├── add_review.html
├── styles.css
├── scripts.js

markdown
Copier
Modifier

## 🌐 Pages

- `index.html` – Homepage with list of places.
- `login.html` – Login page with authentication form.
- `place.html` – Details view of a specific place.
- `add_review.html` – Form for submitting reviews (authenticated users only).

## ⚙️ Technologies

- **HTML5** – Page structure  
- **CSS3** – Styling and layout  
- **JavaScript (ES6)** – Dynamic interactions, API calls  
- **Fetch API** – To communicate with the Flask backend

## 🔐 Authentication

- Login required for:
  - Posting reviews
  - Accessing some pages (redirection to login if not authenticated)

## 🔄 API Interaction

- API base URL (example): `http://127.0.0.1:5000/api/v1/`
- Uses `fetch()` for all HTTP requests.
- Auth tokens stored in `localStorage`.

## 🛠 Setup & Usage

1. Clone the repo  
2. Serve the files locally (e.g. with Live Server or simple Python server)  
3. Make sure the Flask API is running  
4. Open `index.html` in your browser

## ⚠️ CORS Warning

If running locally, CORS issues may occur. Ensure your Flask API includes:

```python
from flask_cors import CORS
CORS(app)
📌 Author
GitHub: Mr Philips