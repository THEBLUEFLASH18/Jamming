import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import './LoggedIn.css'
import PlayList from './Playlist'
import SavedPlaylist from './SavedPlaylist' 
import PlaylistNameModal from './PlaylistNameModal';
import PlaylistEditModal from './PlaylistEditModal';
import CustomAlert from './CustomAlert';


function LoggedIn({token}) {

    const [ searchTerm, setSearchTerm ] = useState('');
    const [ tracks, setTracks ] = useState([])
    const [ playlist, setPlaylist ] = useState([])
    const [ savedPlaylist, setSavedPlaylist ] = useState([])
    const [ isModalOpen, setIsModalOpen ] = useState(false);
    const [ customPlaylistName, setCustomPlaylistName ] = useState('');
    const [ isEditModalOpen, setIsEditModalOpen ] = useState(false);
    const [ playlistToEdit, setPlaylistToEdit ] = useState(null);
    const [ alert, setAlert ] = useState({
      isOpen: false,
      type: '',
      title: '',
      message: ''
    });

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

      const openEditModal = (playlist) => {
        setPlaylistToEdit(playlist);
        setIsEditModalOpen(true);
      };
      
      const closeEditModal = () => {
        setIsEditModalOpen(false);
        setPlaylistToEdit(null);
      };
      
      const showAlert = (type, title, message) => {
        setAlert({
          isOpen: true,
          type,
          title,
          message
        });
      };
      
      const closeAlert = () => {
        setAlert(prev => ({
          ...prev,
          isOpen: false
        }));
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

      async function deletePlaylist(playlistId) {
        try {
          console.log("Attempting to delete playlist with ID:", playlistId);
          
          // First, check if the user is the owner of the playlist
          const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          const playlistData = await playlistResponse.json();
          
          // Get the current user's ID
          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const userData = await userResponse.json();
          
          if (playlistData.owner.id !== userData.id) {
            console.error("Cannot delete playlist: You are not the owner");
            showAlert('error', 'Permission Denied', 'You can only delete playlists that you own.');
            return;
          }
          
          // If the user is the owner, proceed with deletion (unfollow)
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          if (response.status === 200) {
            console.log("Playlist deleted successfully");
            
            // Immediately update the state to remove the deleted playlist
            setSavedPlaylist(prevPlaylists => 
              prevPlaylists.filter(playlist => playlist.id !== playlistId)
            );
            
            // Then refresh all playlists to ensure everything is up to date
            setTimeout(() => {
              fetchUserPlaylists();
            }, 500); // Add a small delay to ensure the API has time to process the deletion
            
            showAlert('success', 'Success', 'Playlist deleted successfully!');
          } else {
            console.error("Failed to delete playlist:", response.status);
            showAlert('error', 'Error', 'Failed to delete playlist. Please try again.');
          }
        } catch (err) {
          console.error("Error deleting playlist:", err);
          showAlert('error', 'Error', 'An error occurred while trying to delete the playlist.');
        }
      }
      
      async function updatePlaylistName(playlistId, newName) {
        try {
          console.log("Attempting to update playlist name for ID:", playlistId);
          
          // First, check if the user is the owner of the playlist
          const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          const playlistData = await playlistResponse.json();
          
          // Get the current user's ID
          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const userData = await userResponse.json();
          
          if (playlistData.owner.id !== userData.id) {
            console.error("Cannot update playlist: You are not the owner");
            showAlert('error', 'Permission Denied', 'You can only edit playlists that you own.');
            closeEditModal();
            return;
          }
          
          // If the user is the owner, proceed with the update
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            method: 'PUT',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: newName
            })
          });
          
          if (response.status === 200) {
            console.log("Playlist name updated successfully");
            // Refresh the playlists after update
            await fetchUserPlaylists();
            closeEditModal();
          } else {
            console.error("Failed to update playlist name:", response.status);
            showAlert('error', 'Error', 'Failed to update playlist name. Please try again.');
          }
        } catch (err) {
          console.error("Error updating playlist name:", err);
          showAlert('error', 'Error', 'An error occurred while trying to update the playlist name.');
        }
      }
      
      async function removeTrackFromPlaylist(playlistId, trackUri) {
        try {
          console.log("Attempting to remove track from playlist ID:", playlistId);
          
          // First, check if the user is the owner of the playlist
          const playlistResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: {
              'Authorization': 'Bearer ' + token
            }
          });
          
          const playlistData = await playlistResponse.json();
          
          // Get the current user's ID
          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const userData = await userResponse.json();
          
          if (playlistData.owner.id !== userData.id) {
            console.error("Cannot modify playlist: You are not the owner");
            showAlert('error', 'Permission Denied', 'You can only modify playlists that you own.');
            return;
          }
          
          // If the user is the owner, proceed with removing the track
          const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tracks: [{ uri: trackUri }]
            })
          });
          
          if (response.status === 200) {
            console.log("Track removed from playlist successfully");
            
            // Update the playlist to edit in state to reflect the change
            if (playlistToEdit && playlistToEdit.id === playlistId) {
              const updatedPlaylist = { ...playlistToEdit };
              updatedPlaylist.tracks.items = updatedPlaylist.tracks.items.filter(
                item => item.track.uri !== trackUri
              );
              updatedPlaylist.tracks.total = updatedPlaylist.tracks.total - 1;
              setPlaylistToEdit(updatedPlaylist);
            }
            
            // Refresh all playlists
            await fetchUserPlaylists();
          } else {
            console.error("Failed to remove track from playlist:", response.status);
            showAlert('error', 'Error', 'Failed to remove track from playlist. Please try again.');
          }
        } catch (err) {
          console.error("Error removing track from playlist:", err);
          showAlert('error', 'Error', 'An error occurred while trying to remove the track from the playlist.');
        }
      }

      async function fetchUserPlaylists() {
        console.log("Fetching user playlists...");
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
          
          console.log("User ID retrieved:", userData.id);
          
          // Then fetch the user's playlists
          const playlistsResponse = await fetch(`https://api.spotify.com/v1/me/playlists?limit=50`, {
            headers: { Authorization: 'Bearer ' + token }
          });

          const playlistsData = await playlistsResponse.json();
          console.log("Playlists data received:", playlistsData);
          
          if (playlistsData.items && playlistsData.items.length > 0) {
            console.log(`Found ${playlistsData.items.length} playlists, fetching details...`);
            
            // For each playlist, fetch the full details including tracks
            const detailedPlaylists = await Promise.all(
              playlistsData.items.map(async (playlist) => {
                console.log(`Fetching details for playlist: ${playlist.name} (${playlist.id})`);
                const detailResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}`, {
                  headers: { Authorization: 'Bearer ' + token }
                });
                return await detailResponse.json();
              })
            );
            
            console.log("Setting state with detailed playlists...");
            setSavedPlaylist([...detailedPlaylists]); // Create a new array to ensure state update
            console.log("State updated with detailed playlists:", detailedPlaylists);
          } else {
            console.log("No playlists found or empty items array:", playlistsData);
            setSavedPlaylist([]); // Set to empty array if no playlists found
          }
        } catch (err) {
          console.error("Error fetching playlists:", err);
          showAlert('error', 'Error', 'Error refreshing playlists. Please try again.');
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
          <SavedPlaylist 
            savedPlaylists={savedPlaylist} 
            onDeletePlaylist={deletePlaylist} 
            onEditPlaylist={openEditModal}
          />
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
      
      <PlaylistEditModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onSave={updatePlaylistName}
        playlist={playlistToEdit}
        onDeleteTrack={removeTrackFromPlaylist}
      />
      
      <CustomAlert
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={closeAlert}
      />
   </div>
  );
}

export default LoggedIn;
