import React from "react";

function SearchResults({tracks}) {



    return(
        <>
            <ul>
                {tracks.map(track => (
                    <div key={track.id}>
                        <p>{track.name} by {track.artists[0].name}</p>
                    </div>
                ))}
            </ul>
        </>
    )
}

export default SearchResults;

