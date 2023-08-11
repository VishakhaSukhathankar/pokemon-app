import React, { useState, useEffect } from 'react';
import { Grid, Button } from '@mui/material';
import PokemonCard from './Pokemon-card';
import {ArrowLeft, ArrowRight} from "../../assets";
import "./styles.scss";

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const openDB = async () => {
        const request = window.indexedDB.open('PokeAPICache', 1);
        return new Promise((resolve, reject) => {
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('pokemonData')) {
                    db.createObjectStore('pokemonData');
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const fetchData = async (page) => {
        try {
            const dataFromCache = await getCachedData(page);
            if (dataFromCache) {
                setData(dataFromCache);
            } else {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${page}&limit=8`);
                const responseData = await response.json();
                const fetchedData = responseData.results;

                await cacheData(page, fetchedData);

                setData(fetchedData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getCachedData = async (page) => {
        const db = await openDB();
        const tx = db.transaction(['pokemonData'], 'readonly');
        const store = tx.objectStore('pokemonData');
        const cachedDataRequest = store.get(page);

        return new Promise((resolve, reject) => {
            cachedDataRequest.onsuccess = () => {
                resolve(cachedDataRequest.result);
            };
            cachedDataRequest.onerror = () => {
                reject(cachedDataRequest.error);
            };
        });
    };

    const cacheData = async (page, dataToCache) => {
        const db = await openDB();
        const tx = db.transaction(['pokemonData'], 'readwrite');
        const store = tx.objectStore('pokemonData');
        store.put(dataToCache, page);
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
