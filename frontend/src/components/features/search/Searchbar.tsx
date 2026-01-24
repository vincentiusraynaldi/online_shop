import React, { useEffect, useState } from 'react';

//todo make dropdown suggestions
//todo make the suggestions have the data of the items from database

const Searchbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setSearchTerm(event.target.value)
    }

    const handleSearch = () => {
        console.log('searched item: ', searchTerm);
        setSearchTerm('');
    }

    useEffect(()=>{
        console.log(searchTerm);
    }, [searchTerm]);

    return (
        <div>
            <input 
                className='' 
                placeholder='Search'
                value={searchTerm}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default Searchbar;