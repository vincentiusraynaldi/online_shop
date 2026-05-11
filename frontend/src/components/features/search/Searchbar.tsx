import React, { useEffect, useState } from 'react';
import { Box, Button, Input } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from '../../../hooks/useProducts';

//todo make dropdown suggestions
//todo make the suggestions have the data of the items from database

const Searchbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    // const { products } = useProduct();
    

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setSearchTerm(event.target.value)
    }

    const handleSearch = () => {
        console.log('searched item: ', searchTerm);
        setSearchTerm(searchTerm);

        const params =  new URLSearchParams(searchParams);

        if(searchTerm !== ""){
            params.set("name", searchTerm);
        }
        else{
            params.delete("name");
        }

        setSearchParams(params);

        navigate(`/search?${params}`)
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

    useEffect(()=>{
        // console.log(searchTerm);
    }, [searchTerm]);

    return (
        // <div>
        //     <input 
        //         className='' 
        //         placeholder='Search'
        //         value={searchTerm}
        //         onChange={handleInputChange}
        //     />
        //     <Input  placeholder="maximal price" onChange={handleInputChange} value={searchTerm}></Input>
        //     <button onClick={handleSearch}>Search</button>
        // </div>

        <Box>
            <Input  
            placeholder='Search'
            _placeholder={{ color: 'inherit' }}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={searchTerm}></Input>
            <Button onClick={handleSearch}>Search</Button>
        </Box>
    );
};

export default Searchbar;