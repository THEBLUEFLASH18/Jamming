import React from 'react';
import './SavedPlaylist.css';

function SavedPlaylist({ savedPlaylists }) {
  console.log("SavedPlaylist props:", savedPlaylists);
  
  if (!savedPlaylists || savedPlaylists.length === 0) {
    return <div className="savedplaylist-box">No saved playlists found</div>;
  }

  // Helper function to format duration (ms to mm:ss)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="savedplaylist-box">
      {savedPlaylists.map(playlist => {
        console.log("Individual playlist:", playlist);
        
        // Get the first 3 tracks (or fewer if there aren't 3)
        const displayTracks = playlist.tracks?.items?.slice(0, 3) || [];
        const totalTracks = playlist.tracks?.total || 0;
        
        return (
          <div key={playlist.id} className="saved-playlist-item">
            <div className="saved-playlist-item-header">
              <div>
                <h3>{playlist.name}</h3>
                <p>{totalTracks} songs • {playlist.owner?.display_name}</p>
              </div>
              <div className="saved-playlist-item-actions">
                {/* You can add buttons here later if needed */}
              </div>
            </div>
            
            <div className="saved-playlist-tracks">
              {displayTracks.map((trackItem, index) => {
                const track = trackItem.track;
                return (
                  <div key={track.id} className="playlist-track-row">
                    <span className="track-index">{index + 1}</span>
                    <span className="track-title">{track.name}</span>
                    <span className="track-duration">
                      {formatDuration(track.duration_ms)}
                    </span>
                  </div>
                );
              })}
              
              {totalTracks > 3 && (
                <div className="saved-playlist-item-more">
                  +{totalTracks - 3} more tracks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SavedPlaylist;
