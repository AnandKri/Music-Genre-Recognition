from flask import Flask, request, jsonify
from pathlib import Path
import pandas as pd
import numpy as np
import tensorflow as tf
import json
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os
import joblib
import gzip

load_dotenv()

app = Flask(__name__)

script_dir = Path(__file__).resolve().parent

model_ElectronicDance_path = script_dir / 'MGR Models/model_ElectronicDance_RandomForestClassifier.pkl.gz'
model_RockMetal_path = script_dir / 'MGR Models/model_RockMetal_RandomForestClassifier.pkl.gz'
model_Pop_path = script_dir / 'MGR Models/model_Pop_RandomForestClassifier.pkl.gz'

with gzip.open(model_ElectronicDance_path, 'rb') as f:
    model_ElectronicDance_RandomForestClassifier = joblib.load(f)
with gzip.open(model_RockMetal_path, 'rb') as f:
    model_RockMetal_RandomForestClassifier = joblib.load(f)
with gzip.open(model_Pop_path, 'rb') as f:
    model_Pop_RandomForestClassifier = joblib.load(f)

features_ElectronicDance = ['instrumentalness','danceability','acousticness','valence','tempo','duration_ms','speechiness','energy']
features_RockMetal = ['acousticness','danceability','energy','loudness','tempo','speechiness','valence','duration_ms','instrumentalness','liveness']
features_Pop = ['speechiness','acousticness','duration_ms','valence','energy','loudness','tempo','danceability','liveness','instrumentalness']


# genre_embeddings_path = script_dir / 'genre_embeddings.json'
# model_architecture_path = script_dir / 'MGR Model/model_architecture.json'
# model_weights_path = script_dir / 'MGR Model/model_weights.weights.h5'

# with open(genre_embeddings_path, 'r') as json_file:
#     genre_embeddings = json.load(json_file)

# with open(model_architecture_path, 'r') as json_file:
#     model_json = json_file.read()

# model = tf.keras.models.model_from_json(model_json)
# model.load_weights(model_weights_path)

# model.compile(optimizer='adam',loss='sparse_categorical_crossentropy',
#               metrics=['accuracy'])

@app.route('/predict_genres', methods=['POST'])

def predict_genres():
    try:

        user_input = request.json
        
        df = pd.DataFrame([user_input])
        
        X_electronic_dance = df[features_ElectronicDance]
        X_rock_metal = df[features_RockMetal]
        X_pop = df[features_Pop]
        
        prob_electronic_dance = int(model_ElectronicDance_RandomForestClassifier.predict_proba(X_electronic_dance)[0][1])
        prob_rock_metal = int(model_RockMetal_RandomForestClassifier.predict_proba(X_rock_metal)[0][1])
        prob_pop = int(model_Pop_RandomForestClassifier.predict_proba(X_pop)[0][1])
        
        ProbSum = prob_electronic_dance + prob_rock_metal + prob_pop
        
        prob_electronic_dance = prob_electronic_dance/ProbSum
        prob_rock_metal = prob_rock_metal/ProbSum
        prob_pop = prob_pop/ProbSum
        
        result = [str(prob_electronic_dance*100) + '% Electronic/Dance',
                  str(prob_rock_metal*100) + '% Rock/Metal',
                  str(prob_pop*100) + '% Pop']
        
        return jsonify({'predictedGenres':result})
        # user_input = request.json

        # features = list(user_input.values())
        # input_features = np.array(features).reshape(1,-1)


        # predictions = model.predict(input_features)[0]

        # genre_embeddings_values = np.array(list(genre_embeddings.values()))


        # similarities = cosine_similarity([predictions], genre_embeddings_values)[0]

        # closest_indices = np.argsort(similarities)[-4:][::-1]

        # closest_genres = [list(genre_embeddings.keys())[i] for i in closest_indices]


        # return jsonify({'predictedGenres': closest_genres})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


port = int(os.environ.get('PORT', 8000))
app.run(host='0.0.0.0',port=port)