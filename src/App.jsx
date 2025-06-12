import React, { useState } from 'react'
import './App.css'
import ConnectToSpotify from './ConnectToSpotify'
import LoggedIn from './LoggedIn'



function App() {

  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ token, setToken ] = useState('')

  return (
    <>
    {loggedIn? <LoggedIn token={token} /> : <ConnectToSpotify  setToken={setToken} setLoggedIn={setLoggedIn}/> }
    </>
  )
}

export default App
