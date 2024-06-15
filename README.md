# Music Genre Recognition (MGR) Project

## Project Overview
The Music Genre Recognition (MGR) project is a web application which predicts the genre for a song selected by user.

The complete project has three major domains:
- Frontend (React)
- Backend (Node.js)
- ML Model (Flask)

The application allows users to search for a song, and once a particular song is selected, user is presented with a 30 second audio preview, true and predicted genres of the song. 

User's search query is sent to the backend, which fetches top 50 search results from Spotify Search>Search for Item API and send it back to frontend. When user selects a particular song from the displayed results, song's trackID and artistID are sent to the backend. True genres are fetched from Spotify Artists>Get Artist API and predicted genres from the ML Model. Input for the ML Model is fetched from Spotify Tracks>Get Track's Audio Features API.