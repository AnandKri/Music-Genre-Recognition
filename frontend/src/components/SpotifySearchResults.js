import React, { useState, useEffect } from 'react';
import {useLocation, useNavigate } from 'react-router-dom';

function SpotifySearchResults() {

  const location = useLocation()
  const {query} = location.state
  const [results, setResults] = useState([]);
  const navigate = useNavigate()


  useEffect(() => {
    
    async function fetchResults(){

      try{
        const nodeServer = process.env.REACT_APP_BACKEND_SERVER_URL
        // const port = process.env.PORT || 5000

        // const response = await fetch(`${nodeServer}:${port}/songSearch`,{
        const response = await fetch(`${nodeServer}/songSearch`,{
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({query:query})
        })

        const gotdata = await response.json()

        setResults(gotdata.tracks.items)
        

      }catch(error){
        console.log("some Error happened : ",error)
      }

    }

    if(query){
      fetchResults()
    }
  },[query]);

  
  const handleClick = (item) => {
    navigate(`/results/detail/${item.id}`, {state: {item}})
  }

  return (
    <div>
      <div id='songsList'>
        <div className='justify-center text-center overflow-y-scroll'>
          <ul>
            {results.map((item, index)=> (
              <li onClick={() => handleClick(item)}
                  className='py-5 border-b border-slate-200 w-60 mx-auto hover:opacity-75 hover:cursor-pointer' 
                  key={index}>
                <img alt='albumCover' src={item.album.images[0].url}/>
                <p className='font-medium text-lg text-left'>{item.name}</p>
                <p className='font-normal text-sm text-gray-600 text-left'>{item.artists[0].name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SpotifySearchResults;
