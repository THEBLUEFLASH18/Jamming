import React from "react";
import './SearchResults.css'

function SearchResults({tracks, setTracks}) {



    return(
        <>
            <ul className="ul-results">
                {tracks.map(track => (
                    <div key={track.id} className="track-item">
                    <div className="track-icon">🎵</div>
                    <div className="track-info">
                        <p className="track-name">{track.name}</p>
                        <p className="track-meta">{track.artists[0].name} • {track.album.name}</p>
                    </div>
                    <button onClick={() => setTracks(track)} className="track-add-button">Add</button>
                    </div>
                ))}
            </ul>
        </>
    )
}

export default SearchResults;

