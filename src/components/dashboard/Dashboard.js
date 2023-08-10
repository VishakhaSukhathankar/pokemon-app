import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import PokemonCard from './Pokemon-card';
import {ArrowLeft, ArrowRight} from "../../assets";
import "./styles.scss";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [cachedData, setCachedData] = useState({});

    const fetchData = (page) => {
        if (cachedData[page]) {
            // Use cached data if available
            setData(cachedData[page]);
        } else {
            fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=8`)
                .then(res => res.json())
                .then(response => {
                    // Cache the fetched data
                    setCachedData(prevCachedData => ({
                        ...prevCachedData,
                        [page]: response.results,
                    }));
                    setData(response.results);
                });
        }
    };

    useEffect(() => {
        fetchData(pageNumber);
    }, [pageNumber, cachedData]);

    const handlePrevClick = () => {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 8);
        }
    };

    const handleNextClick = () => {
        setPageNumber(pageNumber + 8);
    };

    return (
        <div className='wrapper'>
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
        </div>
    );
}

export default Dashboard;
