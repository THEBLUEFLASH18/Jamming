import React, { useState } from 'react';
import './PlaylistNameModal.css'; // Base modal styles
import './PlaylistEditModal.css'; // Additional styles for edit modal

function PlaylistEditModal({ isOpen, onClose, onSave, playlist, onDeleteTrack }) {
  if (!isOpen || !playlist) return null;

  const [editedName, setEditedName] = useState(playlist.name || '');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(playlist.id, editedName);
  };

  // Format duration (ms to mm:ss)
  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content edit-modal">
        <h2>Edit Playlist</h2>
        <form onSubmit={handleSubmit}>
          <div className="edit-name-section">
            <label htmlFor="playlist-name">Playlist Name</label>
            <input
              id="playlist-name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Enter playlist name"
              autoFocus
            />
          </div>
          
          <div className="edit-tracks-section">
            <h3>Tracks</h3>
            <div className="edit-tracks-list">
              {playlist.tracks?.items?.map((trackItem, index) => {
                const track = trackItem.track;
                return (
                  <div key={track.id} className="edit-track-row">
                    <span className="track-index">{index + 1}</span>
                    <div className="track-info">
                      <span className="track-title">{track.name}</span>
                      <span className="track-artist">{track.artists[0].name}</span>
                    </div>
                    <span className="track-duration">
                      {formatDuration(track.duration_ms)}
                    </span>
                    <button 
                      type="button" 
                      className="track-delete-button"
                      onClick={() => onDeleteTrack(playlist.id, track.uri)}
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
              
              {(!playlist.tracks?.items || playlist.tracks.items.length === 0) && (
                <p className="no-tracks-message">No tracks in this playlist</p>
              )}
            </div>
          </div>
          
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistEditModal;
