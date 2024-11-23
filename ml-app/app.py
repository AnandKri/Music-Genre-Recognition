from flask import Flask, request, jsonify
from pathlib import Path
import pandas as pd
from dotenv import load_dotenv
import os
import joblib
import gzip

load_dotenv()

app = Flask(__name__)

script_dir = Path(__file__).resolve().parent

model_ElectronicDance_path = script_dir / 'MGR Model/model_ElectronicDance_RandomForestClassifier.pkl.gz'
model_RockMetal_path = script_dir / 'MGR Model/model_RockMetal_RandomForestClassifier.pkl.gz'
model_Pop_path = script_dir / 'MGR Model/model_Pop_RandomForestClassifier.pkl.gz'

def get_model(model_path):
    with gzip.open(model_path, 'rb') as f:
        model = joblib.load(f)
    return model

features_ElectronicDance = ['instrumentalness','danceability','acousticness','valence','tempo','duration_ms','speechiness','energy']
features_RockMetal = ['acousticness','danceability','energy','loudness','tempo','speechiness','valence','duration_ms','instrumentalness','liveness']
features_Pop = ['speechiness','acousticness','duration_ms','valence','energy','loudness','tempo','danceability','liveness','instrumentalness']

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"message": "server ok"}), 200

@app.route('/predict_genres', methods=['POST'])
def predict_genres():
    try:

        user_input = request.json
        
        df = pd.DataFrame([user_input])
        
        X_electronic_dance = df[features_ElectronicDance]
        X_rock_metal = df[features_RockMetal]
        X_pop = df[features_Pop]
        
        prob_electronic_dance = get_model(model_ElectronicDance_path).predict_proba(X_electronic_dance)[0][1]
        prob_rock_metal = get_model(model_RockMetal_path).predict_proba(X_rock_metal)[0][1]
        prob_pop = get_model(model_Pop_path).predict_proba(X_pop)[0][1]
        
        ProbSum = prob_electronic_dance + prob_rock_metal + prob_pop
        
        prob_electronic_dance = prob_electronic_dance*100//ProbSum
        prob_rock_metal = prob_rock_metal*100//ProbSum
        prob_pop = prob_pop*100//ProbSum
        
        result = [str(prob_electronic_dance) + '%' + 'Electronic/Dance',
                  str(prob_rock_metal) + '%' + ' Rock/Metal',
                  str(prob_pop) + '%' + ' Pop']
        
        return jsonify({'predictedGenres':result})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400


port = int(os.environ.get('PORT', 8000))
app.run(host='0.0.0.0',port=port)