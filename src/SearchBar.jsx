import React, { useState } from 'react';
import './SearchBar.css'

function SearchBar({searchTerm, setSearchTerm, handleSearch}){

    function handleInput({target}){

        setSearchTerm(target.value)
    }

    function handleSubmit(){
        handleSearch(searchTerm)
    }



    return(
        <div className='search-bar-section'>
            <input type="text" value={searchTerm} onChange={handleInput} name='searchTerm' className='search-bar-box' placeholder='Search the songs to add to the playlist'/>
            <button onClick={handleSubmit} className='search-button' >Search</button>
        </div>
    )
}

export default SearchBar;