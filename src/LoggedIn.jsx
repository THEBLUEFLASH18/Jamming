import React, { useState } from 'react';
import SearchBar from './SearchBar'

function LoggedIn() {

    const [ searchTerm, setSearchTerm ] = useState('')

    //function handleChange(){}


  return (
    <div>
      <h2>You are logged in!</h2>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <p>This is where search and playlist features will go.</p>
    </div>
  );
}

export default LoggedIn;