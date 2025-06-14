import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './LoggedIn.css'


function LoggedIn({token}) {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ tracks, setTracks ] = useState([])
    const [ playlist, setPlaylist ] = useState([])


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

      function addTrack(track){
        if(track.id){
          setPlaylist(track.name)
        }
        else{
          console.log("Error occurred while trying to add this sond to your playlist.")
        }
      }


  return (
   <div className='LoggedIn-div'>
      <div className="search-bar">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        handleSearch={handleSearch} />
      </div>
      <div className="info-container">
        <div className='left-side'>
        <h1>Search Results</h1>
        <SearchResults tracks={tracks} setTracks={addTrack} />
        </div>
        <div className="right-side">
          <div className="top-box">Your current playlist will live here</div>
          <div className="bottom-box">Your past playlist will live here</div>
        </div>
      </div>
   </div>
  );
}

export default LoggedIn;