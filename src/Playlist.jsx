import { useState } from 'react'
import './Playlist.css'

function PlayList({playlist, removeTrack, savePlaylist, openModal}){

    return(
        <div className='current-playlist'>
            {playlist.map(track => (
                <div key={track.id} className="playlist-track">
                    <div className="playlist-track-icon">🎵</div>
                    <div className="playlist-track-info">
                        <p className="playlist-track-title">{track.name}</p>
                        <p className="playlist-track-artist">{track.artists[0].name}</p>
                    </div>
                    <button onClick={() => removeTrack(track)} className="playlist-remove-button">🗑</button>
                </div>
            ))}
            <button onClick={openModal} className='save-button'>Save</button>
        </div>
    )
}

export default PlayList;
