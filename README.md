# Music Genre Recognition (MGR) Project

## Brief Overview
The Music Genre Recognition (MGR) project is a web application which predicts the genre for a song selected by the user. The application allows users to search for a song, and once a particular song is selected, user is presented with the true and predicted genres of the song.

## Problem Addressed
Music artists and streaming services annotate the genre of the music manully. Most of the time, the artists decide the genre of the song which they had created. 
Through this project I've tried to explore that to what extent does the music itself decides the genre of a song.

## Project Description
User's search query is sent to the backend, which fetches top 50 search results from Spotify Search>Search for Item API and send it back to frontend. When user selects a particular song from the displayed results, song's trackID and artistID are sent to the backend. True genres are fetched from Spotify Artists>Get Artist API and predicted genres from the ML Model. Input for the ML Model is fetched from Spotify Tracks>Get Track's Audio Features API.

## Technology Stack
- Frontend: React
- Backend: Express
- Machine Learning: Flask

## Working
![Working](./Data/2024-08-1600-05-38-ezgif.com-video-to-gif-converter.gif)

## Architecture
![Architecture Diagram](./Data/MGR%20Client-Server%20Architecture.png)

## MGR Model Training
### Training Dataset
Spotify Dataset (derived from [here](https://www.kaggle.com/datasets/maharshipandya/-spotify-tracks-dataset)) was used for model training. Original dataset contained 114 Genres and for the majority of these genres not enough data points were present. These 114 genres were mapped to 8 parent genres - namely "Electronic/Dance"; "Rock/Metal"; "Pop"; "Country/Folk"; "Classical/Orchestral"; "R&B/Soul"; "Blues/Jazz" and "Hip-Hop". You can refer the [dataset](./Data/Spotify%20Dataset.xlsx) for mapping structure.

### Choice Of Machine Learning Model

In philosophy, Occam's razor is a problem-solving principle that suggests - "The Simplest explanation is usually the best one."

For classification, binary classifiers were trained for each of the genres (Only Electronic/Dance, Rock/Metal and Pop were finally considered due to data imbalance). Random Forest was giving the best predictions among the selected traditional ML algorithms.

### Prediction Algorithm
For a given song, all three models will give their prediction of probability by which the song can belong to the respective genre. User is presented by the normalized probability ratio of individual positive probabilities given by all the models.

## MGR Algorithm Performance 
Below are the results showing the performance of the MGR algorithm on some of the well know songs.

![Changes Black Sabbath](./Data/Changes%20Black%20Sabbath.png)
![For What It's Worth Buffalo Springfield](./Data/For%20What%20It's%20Worth%20Buffalo%20Springfield.png)
![Gimme! Gimme! Gimme! ABBA](./Data/Gimme!%20Gimme!%20Gimme!%20ABBA.png)
![Heroes David Bowie](./Data/Heroes%20David%20Bowie.png)
![Sweet Emotion Aerosmith](./Data/Sweet%20Emotion%20Aerosmith.png)