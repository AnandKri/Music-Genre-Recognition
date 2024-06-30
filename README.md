# Music Genre Recognition (MGR) Project

## Brief Overview
The Music Genre Recognition (MGR) project is a web application which predicts the genre for a song selected by the user. The application allows users to search for a song, and once a particular song is selected, user is presented with the true and predicted genres of the song.

## Problem Addressed
Music artists and streaming services annotate the genre of the music manully. Most of the time, the artists decide the genre of the song which they had created. 
Through this project I've tried to explore that to what extent does the music itself decides the genre of a song.

## Project Description
User's search query is sent to the backend, which fetches top 50 search results from Spotify Search>Search for Item API and send it back to frontend. When user selects a particular song from the displayed results, song's trackID and artistID are sent to the backend. True genres are fetched from Spotify Artists>Get Artist API and predicted genres from the ML Model. Input for the ML Model is fetched from Spotify Tracks>Get Track's Audio Features API.

## Technology Stack
- Frontend: React, HTML, CSS, Tailwind
- Backend: Express
- Machine Learning: Python, Flask, TensorFlow

## Architecture
![Architecture Diagram](./backend/MGR%20Client-Server%20Architecture.png)
