"""
Python ML Microservice
======================
Lightweight Flask service that loads ML models and serves predictions
Called by Node.js backend
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Allow requests from Node.js

# Load models once at startup
MODEL_DIR = './models/'

print("🔄 Loading ML models...")

try:
    model = pickle.load(open(f'{MODEL_DIR}skill_recommender_model.pkl', 'rb'))
    company_encoder = pickle.load(open(f'{MODEL_DIR}company_encoder.pkl', 'rb'))
    designation_encoder = pickle.load(open(f'{MODEL_DIR}designation_encoder.pkl', 'rb'))
    skill_encoder = pickle.load(open(f'{MODEL_DIR}skill_encoder.pkl', 'rb'))
    print("✅ Models loaded successfully!")
except Exception as e:
    print(f"❌ Error loading models: {e}")
    exit(1)


def predict_skills(company, designation):
    """Make prediction using loaded models"""
    try:
        # Encode inputs
        company_encoded = company_encoder.transform([company])[0]
        designation_encoded = designation_encoder.transform([designation])[0]
        input_data = np.array([[company_encoded, designation_encoded]])
        
        # Get predictions from all trees for confidence
        all_tree_predictions = np.array([
            tree.predict(input_data)[0] 
            for tree in model.estimators_
        ])
        
        # Calculate confidence scores
        confidence_scores = all_tree_predictions.mean(axis=0)
        
        # Get top 10 skills by confidence
        top_indices = np.argsort(confidence_scores)[::-1][:10]
        
        # Format results
        recommended_skills = []
        for idx in top_indices:
            skill_name = skill_encoder.classes_[idx]
            confidence = confidence_scores[idx]
            
            if confidence > 0.05:  # At least 5% confidence
                recommended_skills.append({
                    'skill': skill_name,
                    'confidence': f"{confidence * 100:.1f}%",
                    'percentage': round(confidence * 100)
                })
        
        return recommended_skills, None
        
    except Exception as e:
        return None, str(e)


@app.route('/predict', methods=['POST'])
def predict():
    """Prediction endpoint"""
    try:
        data = request.get_json()
        company = data.get('company')
        designation = data.get('designation')
        
        if not company or not designation:
            return jsonify({'error': 'Missing company or designation'}), 400
        
        # Check if company exists
        if company not in company_encoder.classes_:
            return jsonify({'error': f'Company "{company}" not found'}), 404
        
        # Check if designation exists
        if designation not in designation_encoder.classes_:
            return jsonify({'error': f'Designation "{designation}" not found'}), 404
        
        # Make prediction
        skills, error = predict_skills(company, designation)
        
        if error:
            return jsonify({'error': error}), 500
        
        return jsonify({
            'company': company,
            'designation': designation,
            'skills': skills,
            'success': True
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/companies', methods=['GET'])
def get_companies():
    """Get list of companies"""
    return jsonify({
        'companies': company_encoder.classes_.tolist()
    }), 200


@app.route('/designations', methods=['GET'])
def get_designations():
    """Get list of designations"""
    return jsonify({
        'designations': designation_encoder.classes_.tolist()
    }), 200


@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'healthy', 'service': 'ml-service'}), 200


if __name__ == '__main__':
    print("🚀 Starting ML Service on port 5001...")
    app.run(host='0.0.0.0', port=5001, debug=False)