import React, { useState } from 'react'
import './App.css'
import ConnectToSpotify from './ConnectToSpotify'
import LoggedIn from './LoggedIn'




function App() {

  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ token, setToken ] = useState('')

  return (
    <div className='AppDiv'>
    {loggedIn? <LoggedIn token={token} /> : <ConnectToSpotify  setToken={setToken} setLoggedIn={setLoggedIn}/> }
    </div>
  )
}

export default App
