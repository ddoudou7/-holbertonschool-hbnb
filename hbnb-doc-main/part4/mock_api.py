from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

USERS = {
    "user@test.com": "123456"
}

PLACES = [
    {
        "id": 1,
        "name": "Cozy Apartment",
        "location": "Paris",
        "description": "Small and cozy",
        "price": 80
    },
    {
        "id": 2,
        "name": "Beach House",
        "location": "Nice",
        "description": "Sea view with modern comforts",
        "price": 150
    },
    {
        "id": 3,
        "name": "Mountain Cabin",
        "location": "Alps",
        "description": "Nature getaway in the forest",
        "price": 100
    }
]

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if USERS.get(email) == password:
        return jsonify({
            "access_token": "fake-jwt-token-123456"
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/places', methods=['GET'])
def get_places():
    auth = request.headers.get('Authorization')
    if not auth or not auth.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify(PLACES), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)