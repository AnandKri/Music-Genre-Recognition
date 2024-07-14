import dotenv from 'dotenv';
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import bodyParser from 'body-parser';
dotenv.config()

const clientId = process.env.REACT_APP_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json())
app.listen(port, function (err) {
    if (err) console.log(err);
    console.log(`Server listening on PORT : ${port}`);
});


// Function to get Spotify access token
async function getAccessToken() {
    const authOptions = {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials'
      })
    };
  
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
      const data = await response.json();
  
      if (response.ok) {
        return data.access_token;
      } else {
        console.error('Error fetching access token:', data);
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }


// songSearchAPI - SpotifySearchResults
app.post('/songSearch', async (req,res) => {
    const {query} = req.body
    
    console.log(query)
    console.log(encodeURIComponent(query))

    try{
        const accessToken = await getAccessToken();
        const spotifySearchUrl = `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(query)}`;
        const spotifySearchOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const SpotifySearchAPI_res = await fetch(spotifySearchUrl, spotifySearchOptions)
        const data = await SpotifySearchAPI_res.json()

        res.json(data)

    } catch(error) {
        console.error('Error searching Spotify: ', error)
        res.status(500).json({error: 'Failed to search Spotify'})
    }
});

// songNameAPI - trueGenre
app.post('/songName', async (req,res) => {
    const {artistId, trackId} = req.body
    
    try{

        const accessToken = await getAccessToken();
        const spotifyArtistUrl = `https://api.spotify.com/v1/artists/${encodeURIComponent(artistId)}`
        const spotifyArtistOptions = {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const SpotifyArtistAPI_res = await fetch(spotifyArtistUrl, spotifyArtistOptions)
        const SpotifyArtistAPI_data = await SpotifyArtistAPI_res.json()
        const trueGenres = await SpotifyArtistAPI_data.genres
        console.log(trueGenres)



        const spotifyAudioFeaturesUrl = `https://api.spotify.com/v1/audio-features/${encodeURIComponent(trackId)}`
        const spotifyAudioFeaturesOptions = {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${accessToken}`
          }
        }

        const SpotifyAudioFeaturesAPI_res = await fetch(spotifyAudioFeaturesUrl,spotifyAudioFeaturesOptions)
        const SpotifyAudioFeaturesAPI_data = await SpotifyAudioFeaturesAPI_res.json()
        const AudioFeatures = {
          duration_ms: SpotifyAudioFeaturesAPI_data.duration_ms,
          danceability: SpotifyAudioFeaturesAPI_data.danceability,
          energy: SpotifyAudioFeaturesAPI_data.energy,
          key: SpotifyAudioFeaturesAPI_data.key,
          loudness: SpotifyAudioFeaturesAPI_data.loudness,
          mode: SpotifyAudioFeaturesAPI_data.mode,
          speechiness: SpotifyAudioFeaturesAPI_data.speechiness,
          acousticness: SpotifyAudioFeaturesAPI_data.acousticness,
          instrumentalness: SpotifyAudioFeaturesAPI_data.instrumentalness,
          liveness: SpotifyAudioFeaturesAPI_data.liveness,
          valence: SpotifyAudioFeaturesAPI_data.valence,
          tempo: SpotifyAudioFeaturesAPI_data.tempo,
          time_signature: SpotifyAudioFeaturesAPI_data.time_signature
        }

        console.log(AudioFeatures)

        const flaskServer = process.env.FLASK_SERVER_URL
        const flaskPort = process.env.FLASK_PORT

        const predictionRes = await fetch(`${flaskServer}:${flaskPort}/predict_genres`,{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body: JSON.stringify(AudioFeatures)
        })
        const prediction = await predictionRes.json()
        const predictedGenres = prediction.predictedGenres

        res.json({
            T_genre: trueGenres,
            P_genre: predictedGenres
        })

    }catch(error){
        console.error('Error occurred: ', error)
    }
})