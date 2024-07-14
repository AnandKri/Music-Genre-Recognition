from flask import Flask, request, jsonify
from pathlib import Path
import pandas as pd
import numpy as np
import tensorflow as tf
import json
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

script_dir = Path(__file__).resolve().parent
genre_embeddings_path = script_dir / 'genre_embeddings.json'
model_architecture_path = script_dir / 'MGR Model/model_architecture.json'
model_weights_path = script_dir / 'MGR Model/model_weights.weights.h5'

with open(genre_embeddings_path, 'r') as json_file:
    genre_embeddings = json.load(json_file)

with open(model_architecture_path, 'r') as json_file:
    model_json = json_file.read()

model = tf.keras.models.model_from_json(model_json)
model.load_weights(model_weights_path)

model.compile(optimizer='adam',loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

@app.route('/predict_genres', methods=['POST'])

def predict_genres():
    try:
        user_input = request.json

        features = list(user_input.values())
        input_features = np.array(features).reshape(1,-1)


        predictions = model.predict(input_features)[0]

        genre_embeddings_values = np.array(list(genre_embeddings.values()))


        similarities = cosine_similarity([predictions], genre_embeddings_values)[0]

        closest_indices = np.argsort(similarities)[-4:][::-1]

        closest_genres = [list(genre_embeddings.keys())[i] for i in closest_indices]


        return jsonify({'predictedGenres': closest_genres})
    except Exception as e:
        return jsonify({'error': str(e)}), 400


port = int(os.environ.get('FLASK_PORT', 8000))
app.run(host='0.0.0.0',port=port)