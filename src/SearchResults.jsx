import React from "react";

function SearchResults({tracks}) {



    return(
        <>
            <ul>
                {tracks.map((track) =>{
                    return <li>{track}</li>
                })}
            </ul>
        </>
    )
}

export default SearchResults;

