from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import os

app = Flask(__name__)
CORS(app)  # Allow frontend interactions

# ----------------- DATABASE SETUP -----------------
def create_database():
    """Creates a database with crime cases if it doesn't exist."""
    conn = sqlite3.connect('crime_database.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS cases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            case_title TEXT,
            case_description TEXT,
            case_status TEXT
        )
    ''')
    conn.commit()
    conn.close()

create_database()  # Ensure database is created

# ----------------- ROUTES -----------------
@app.route('/')
def home():
    """Serve the main UI page."""
    return render_template('index.html')

@app.route('/search', methods=['GET'])
def search_cases():
    """Search cases based on a query."""
    query = request.args.get('q', '').strip().lower()
    if not query:
        return jsonify({"error": "Empty search query"}), 400

    conn = sqlite3.connect('crime_database.db')
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cases WHERE LOWER(case_title) LIKE ?", ('%' + query + '%',))
    results = cursor.fetchall()
    conn.close()

    if results:
        cases = [{"id": r[0], "title": r[1], "description": r[2], "status": r[3]} for r in results]
        return jsonify({"cases": cases})
    else:
        return jsonify({"message": "No cases found"}), 404

@app.route('/add_case', methods=['POST'])
def add_case():
    """Add a new crime case."""
    data = request.get_json()
    case_title = data.get('title')
    case_description = data.get('description')
    case_status = data.get('status', 'Open')  # Default to 'Open'

    if not case_title or not case_description:
        return jsonify({"error": "Missing case title or description"}), 400

    conn = sqlite3.connect('crime_database.db')
    cursor = conn.cursor()
    cursor.execute("INSERT INTO cases (case_title, case_description, case_status) VALUES (?, ?, ?)", 
                   (case_title, case_description, case_status))
    conn.commit()
    conn.close()

    return jsonify({"message": "Case added successfully"}), 201

@app.route('/chat', methods=['POST'])
def chat():
    """Process user message and return chatbot response."""
    data = request.get_json()
    user_message = data.get("message", "").lower()

    # Simple rule-based responses
    responses = {
        "hello": "Hello! How can I assist you today?",
        "how are you": "I'm just a bot, but I'm here to help!",
        "case details": "Please provide the case ID to fetch details.",
        "search case": "Enter the suspect's name or case title to search.",
        "goodbye": "Goodbye! Stay safe.",
    }

    # Default response if no keyword matches
    bot_response = responses.get(user_message, "I'm not sure how to answer that. Try asking something else.")

    return jsonify({"response": bot_response})


@app.route('/history')
def history():
    """Serve the search history page."""
    return render_template('history.html')

@app.route('/reports')
def reports():
    """Serve the reports page."""
    return render_template('reports.html')

@app.route('/analytics')
def analytics():
    """Serve the crime analytics page."""
    return render_template('analytics.html')


# ----------------- RUN THE APP -----------------
if __name__ == '__main__':
    app.run(debug=True)


