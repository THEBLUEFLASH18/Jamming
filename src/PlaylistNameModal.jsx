import React from 'react';
import './PlaylistNameModal.css';

function PlaylistNameModal({ isOpen, onClose, onSave, playlistName, setPlaylistName }) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Name Your Playlist</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            placeholder="Enter playlist name"
            autoFocus
          />
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlaylistNameModal;
