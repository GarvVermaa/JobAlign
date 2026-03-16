# JobAlign 🎯

**JobAlign** is a career intelligence platform that tells you exactly which skills you need to land a specific role at a specific company — powered by a machine learning model trained on real resume data.

Select a target company and desired role, and JobAlign surfaces the top skills that professionals already in that position actually have, ranked by confidence score.

---

## ✨ Features

- 🏢 **Company & Role Targeting** — Choose from 500+ companies and 120+ designations
- 🤖 **ML-Powered Skill Prediction** — Random Forest model trained on thousands of real resumes
- 📊 **Confidence Scoring** — Each skill is ranked by how consistently it appears across verified profiles
- 📈 **Visual Chart** — Bar chart breakdown of skill importance
- ⚡ **Microservice Architecture** — Decoupled Node.js backend and Python ML service

---

## 🏗️ Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│                 │       │                  │       │                  │
│  Frontend       │──────▶│  Node.js Backend │──────▶│  Python ML       │
│  (HTML/CSS/JS)  │       │  (Express)       │       │  Service (Flask) │
│  Port: 5000     │       │  Port: 5000      │       │  Port: 5001      │
│                 │       │                  │       │                  │
└─────────────────┘       └──────────────────┘       └──────────────────┘
```

The Node.js server serves the static frontend and proxies API requests to the Python Flask microservice, which loads and runs the pre-trained scikit-learn models.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript, Chart.js |
| Backend | Node.js, Express |
| ML Service | Python, Flask, scikit-learn |
| ML Model | Random Forest Classifier |

---

## 📁 Project Structure

```
JobAlign/
├── frontend/
│   ├── index.html          # Main UI
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── assets/
├── backend/
│   ├── server.js           # Express server
│   ├── routes/
│   │   └── analysis.js     # API routes
│   └── package.json
└── ml_model/
    ├── ml_service.py       # Flask microservice
    ├── model.ipynb         # Model training notebook
    ├── requirements.txt
    ├── resume_dataset_large.csv
    └── models/
        ├── skill_recommender_model.pkl
        ├── company_encoder.pkl
        ├── designation_encoder.pkl
        └── skill_encoder.pkl
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Python](https://python.org/) 3.8+

### 1. Clone the repository

```bash
git clone https://github.com/your-username/JobAlign.git
cd JobAlign
```

### 2. Start the Python ML Service

```bash
cd ml_model
pip install -r requirements.txt
python ml_service.py
```

The ML service will start on **http://localhost:5001**

### 3. Start the Node.js Backend

Open a new terminal:

```bash
cd backend
npm install
npm start
```

The app will be available at **http://localhost:5000**

### 4. Open the App

Visit [http://localhost:5000](http://localhost:5000) in your browser.

---

## 🔌 API Endpoints

All routes are prefixed with `/api/analysis`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/analysis/companies` | List all available companies |
| `GET` | `/api/analysis/designations` | List all available roles |
| `POST` | `/api/analysis/analyze` | Get skill predictions |
| `GET` | `/api/health` | Backend health check |

### Example — Analyze Skills

```http
POST /api/analysis/analyze
Content-Type: application/json

{
  "company": "Google",
  "designation": "Software Engineer"
}
```

**Response:**
```json
{
  "company": "Google",
  "designation": "Software Engineer",
  "skills": [
    { "skill": "Python", "confidence": "87.3%", "percentage": 87 },
    { "skill": "System Design", "confidence": "76.1%", "percentage": 76 }
  ],
  "success": true
}
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
ML_SERVICE_URL=http://localhost:5001
```

---

## 🧠 How the ML Model Works

1. **Dataset** — Trained on `resume_dataset_large.csv`, a large collection of resume data with company, designation, and skill labels.
2. **Encoding** — Company names and designations are label-encoded. Skills are multi-label encoded.
3. **Model** — A `RandomForestClassifier` from scikit-learn predicts the probability of each skill for a given company-role combination.
4. **Confidence** — Confidence scores are derived by averaging predictions across all trees in the forest. Only skills with ≥ 5% confidence are returned.

To retrain the model, open and run `ml_model/model.ipynb`.

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
