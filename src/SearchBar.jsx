import React, { useState } from 'react';

function SearchBar({searchTerm, setSearchTerm, handleSearch}){

    function handleInput({target}){

        setSearchTerm(target.value)
    }

    function handleSubmit(){
        handleSearch(searchTerm)
    }



    return(
        <>
        <input type="text" value={searchTerm} onChange={handleInput} name='searchTerm' />
        <button onClick={handleSubmit} >Search</button>
        </>
    )
}

export default SearchBar;