import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import PokemonCard from './Pokemon-card';
import { ArrowLeft, ArrowRight } from "../../assets";
import { openDB, cacheData, getCachedData } from "../../utils/helpers/IndexedDBUtility";
import "./styles.scss";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const fetchData = async (page) => {
        try {
            const db = await openDB("PokeAPICache", 1);
            const dataFromCache = await getCachedData(db, 'pokemonData', page);
            if (dataFromCache) {
                setData(dataFromCache);
            } else {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=8`);
                const responseData = await response.json();
                const fetchedData = responseData.results;
                await cacheData(db, 'pokemonData', page, fetchedData);
                setData(fetchedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(pageNumber);
    }, [pageNumber]);

    const handlePrevClick = () => {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 8);
        }
    };
    const handleNextClick = () => {
        setPageNumber(pageNumber + 8);
    };

    return (
        <>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {data.map((pokemon, ind) => (
                    <Grid item xs={3} key={ind}>
                        <PokemonCard pokemonName={pokemon.name} />
                    </Grid>
                ))}
            </Grid>
            <div className='pagination'>                
                <Button disabled={pageNumber <= 0} onClick={handlePrevClick} variant="contained">
                    <span className="arw-left"><ArrowLeft/></span>  Prev
                </Button>
                <Button onClick={handleNextClick} variant="contained">
                    Next <span className="arw-right"><ArrowRight/></span>
                </Button>
           </div>
        </>
    );
}

export default Dashboard;
