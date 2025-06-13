import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './LoggedIn.css'


function LoggedIn({token}) {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ tracks, setTracks ] = useState([])


    async function getData(fullUrl) {
        const response = await fetch(fullUrl, { headers: { Authorization: 'Bearer ' + token} })
        const data = await response.json()
        console.log(data.tracks.items)
        if (data.tracks && data.tracks.items) {
            setTracks(data.tracks.items);
        } else {
            console.log('No tracks found:', data);
        }
    }


    function handleSearch(searchTerm){
        const startingUri = 'https://api.spotify.com/v1/search'
        const q = encodeURIComponent(searchTerm)
        const type = "track"

        const fullUrl = startingUri + '?q=' + q + '&type=' + type

        getData(fullUrl)

    }


  return (
    <div className='LoggedDiv'>
      <h2>You are logged in!</h2>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}
       handleSearch={handleSearch} />
      <p>This is where search and playlist features will go.</p>
      <SearchResults tracks={tracks} />
    </div>
  );
}

export default LoggedIn;