import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './LoggedIn.css'
import PlayList from './Playlist'
import SavedPlaylist from './SavedPlaylist' 
import PlaylistNameModal from './PlaylistNameModal';


function LoggedIn({token}) {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ tracks, setTracks ] = useState([])
    const [ playlist, setPlaylist ] = useState([])
    const [ savedPlaylist, setSavedPlaylist ] = useState([])
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ customPlaylistName, setCustomPlaylistName ] = useState('');

    useEffect(() => {
      fetchUserPlaylists();
    }, []);


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
        if(!playlist.find(saved => saved.id === track.id)){
          setPlaylist((prev) => [...prev, track])
        }
        else{
          console.log("Error occurred while trying to add this sond to your playlist.")
        }
      }

      function removeTrack(track){
        setPlaylist(prev => prev.filter(t => t.id !== track.id));
      }

      const openModal = () => {
        setCustomPlaylistName(''); // Reset the name
        setIsModalOpen(true);
      };
      
      const closeModal = () => {
        setIsModalOpen(false);
      };
      
      const handleSaveWithName = async () => {
        await savePlaylistWithName(customPlaylistName || 'Jamming Playlist');
        setIsModalOpen(false);
      };
      
      // Keep this function for backward compatibility
      async function savePlaylist() {
        await savePlaylistWithName('Jamming Playlist');
      }
      
      async function savePlaylistWithName(playlistName) {
        try {
          const response = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: 'Bearer ' + token }
          });
          const data = await response.json();

          if (!data.id) {
            console.error("Failed to retrieve user ID.");
            return;
          }

          const userId = data.id;

          const createPlaylistResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: playlistName,
              description: 'Playlist from Jammming App',
              public: true
            })
          });

          const playlistData = await createPlaylistResponse.json();
          if (!playlistData.id) {
              console.error("Failed to create playlist.");
              return;
            }
    
          // Add tracks to playlist
          const trackUris = playlist.map(track => track.uri);
          
          if (trackUris.length > 0) {
            const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                uris: trackUris
              })
            });
            
            const addTracksData = await addTracksResponse.json();
            console.log("Added tracks to playlist:", addTracksData);
          }
          
           console.log("Created playlist:", playlistData);
    
            // Add this line to refresh the playlists after creating a new one
            await fetchUserPlaylists();
            
          } catch (err) {
            console.error("Error saving playlist:", err);
          }
      }

      async function fetchUserPlaylists() {
        try {
          // First get the user ID
          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: 'Bearer ' + token }
          });
          const userData = await userResponse.json();
          
          if (!userData.id) {
            console.error("Failed to retrieve user ID.");
            return;
          }
          
          // Then fetch the user's playlists
          const playlistsResponse = await fetch(`https://api.spotify.com/v1/me/playlists`, {
            headers: { Authorization: 'Bearer ' + token }
          });

        const playlistsData = await playlistsResponse.json();
        
            if (playlistsData.items && playlistsData.items.length > 0) {
              // For each playlist, fetch the full details including tracks
              const detailedPlaylists = await Promise.all(
                playlistsData.items.map(async (playlist) => {
                  const detailResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
                    headers: { Authorization: 'Bearer ' + token }
                  });
                  return await detailResponse.json();
                })
              );
              
              setSavedPlaylist(detailedPlaylists);
              console.log("Fetched detailed playlists:", detailedPlaylists);
            } else {
              console.log("No playlists found or empty items array:", playlistsData);
            }
            } catch (err) {
              console.error("Error fetching playlists:", err);
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
          <div className="top-box">
            <h1>Current Playlist</h1>
            <PlayList playlist={playlist} setPlaylist={addTrack} removeTrack={removeTrack} savePlaylist={savePlaylist} openModal={openModal}/>
          </div>
          <div className="bottom-box">
          <div className="saved-playlist-header">
            <h1>Saved Playlist</h1>
          </div>
          <SavedPlaylist savedPlaylists={savedPlaylist}/>
          <div className="refresh">
            <button onClick={fetchUserPlaylists} className="refresh-button">🔄 Refresh</button>
          </div>
        </div>

        </div>
      </div>
      <PlaylistNameModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveWithName}
        playlistName={customPlaylistName}
        setPlaylistName={setCustomPlaylistName}
      />
   </div>
  );
}

export default LoggedIn;
