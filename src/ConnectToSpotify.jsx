import React, { useState, useEffect } from "react";
import './ConnectToSpotify.css'


function ConnectToSpotify({setLoggedIn, setToken }){



    function handleSubmit(){
        const first_portion_url = 'https://accounts.spotify.com/authorize'
        const client_id = 'f957c80ba97745288a7f7b71b4daf815'
        const redirect_uri = 'http://127.0.0.1:5174/'
        const response_type='token'
        
        const yourFullUrl = first_portion_url + '?response_type=' + response_type + '&client_id=' + client_id + '&redirect_uri=' + redirect_uri 
        console.log(yourFullUrl)
        window.location = yourFullUrl
    }

    useEffect(() =>{

        const newUri = window.location.hash.split('&')
        const subUri = newUri[0].split('=')
        const neededUri = subUri[1]
        if (neededUri) {
            setToken(neededUri);
            setLoggedIn(true);
        }

    }, [window.location.hash])


    return(
        <>
            <div>
               <h2>Connect to your Spotify music so you can add songs to a playlist.</h2>
               <button type="submit" value="submit" onClick={handleSubmit}>Connect</button>
            </div>
        </>
    )
}

export default ConnectToSpotify;