from flask import Flask, jsonify, request, send_from_directory

app = Flask(__name__, static_folder='.')

DEMO_USER = {
    "username": "admin",
    "password": "admin123",
}

MOCK_USAGE = {
    "institutions": [
        {"name": "MIT Media Lab", "usage": 97},
        {"name": "Stanford AI Hub", "usage": 92},
        {"name": "ETH Zurich", "usage": 89},
        {"name": "Oxford Future Lab", "usage": 84},
    ],
    "fields": [
        {"name": "Bioinformatics", "usage": 95},
        {"name": "Climate Modeling", "usage": 88},
        {"name": "Computational Neuroscience", "usage": 83},
        {"name": "Material Discovery", "usage": 81},
    ],
}


@app.route("/")
def index():
    return send_from_directory(".", "index.html")


@app.route("/style.css")
def style():
    return send_from_directory(".", "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(".", "script.js")


@app.post("/api/login")
def login():
    payload = request.get_json(silent=True) or {}
    valid = (
        payload.get("username") == DEMO_USER["username"]
        and payload.get("password") == DEMO_USER["password"]
    )
    return jsonify({"success": valid})


@app.get("/api/usage")
def usage():
    return jsonify(MOCK_USAGE)


if __name__ == "__main__":
    app.run(debug=True)
