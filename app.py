import os
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)

# Load company data
try:
    with open("companyData.txt", "r", encoding="utf-8") as f:
        company_data = f.read()
except FileNotFoundError:
    company_data = "No company data available."

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_data = request.get_json()
    user_message = user_data.get("message", "")

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful chatbot. When answering questions, if a detailed response is needed, reference the company's official website: https://autorentaletc.com/ or https://are.travel/. If you can answer directly, provide a concise response."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=200,
            temperature=0.7,
        )

        reply = response.choices[0].message.content.strip()
        return jsonify({"reply": reply})
    except Exception as e:
        print("ERROR:", str(e))  # Debugging information
        return jsonify({"error": "Internal Server Error"}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)