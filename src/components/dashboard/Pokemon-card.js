import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon } from '@mui/material';
import { Weight, Height } from "../../assets";
import { Link } from 'react-router-dom';


const PokemonCard = ({ pokemonName }) => {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [pokemonDesc, setPokemonDesc] = useState(null);

    const openDB = async () => {
        const request = window.indexedDB.open('PokemonCache', 1);
        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const getPokemonDetails = async () => {
        try {
            const db = await openDB();
            const tx = db.transaction(['details'], 'readonly');
            const store = tx.objectStore('details');
            const cachedDataRequest = store.get(pokemonName);

            cachedDataRequest.onsuccess = () => {
                const cachedData = cachedDataRequest.result;
                if (cachedData) {
                    setPokemonDetails(cachedData);
                } else {
                    fetchDetailsAndCache(db);
                }
            };
        } catch (error) {
            console.error('Error fetching details:', error);
        }
    };

    const fetchDetailsAndCache = async (db) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const details = await response.json();
            setPokemonDetails(details);

            const tx = db.transaction(['details'], 'readwrite');
            const store = tx.objectStore('details');
            store.put(details, pokemonName);
        } catch (error) {
            console.error('Error fetching details from API:', error);
        }
    };

    const getPokemonDescription = async () => {
        try {
            const db = await openDB();
            const tx = db.transaction(['descriptions'], 'readonly');
            const store = tx.objectStore('descriptions');
            const cachedDataRequest = store.get(pokemonName);

            cachedDataRequest.onsuccess = () => {
                const cachedData = cachedDataRequest.result;
                if (cachedData) {
                    setPokemonDesc(cachedData);
                } else {
                    fetchDescriptionAndCache(db);
                }
            };
        } catch (error) {
            console.error('Error fetching description:', error);
        }
    };

    const fetchDescriptionAndCache = async (db) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
            const speciesData = await response.json();
            const description = speciesData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
            setPokemonDesc(description);

            const tx = db.transaction(['descriptions'], 'readwrite');
            const store = tx.objectStore('descriptions');
            store.put(description, pokemonName);
        } catch (error) {
            console.error('Error fetching description from API:', error);
        }
    };

    useEffect(() => {
        getPokemonDetails();
        getPokemonDescription();
    }, [pokemonName]);

    if (!pokemonDetails || !pokemonDesc) {
        return <p>Loading...</p>;
    }

    return (
        <Card sx={{ height: 370 }}>
            <Link to={`/pokemon/${pokemonDetails?.name}`}>
            <CardContent>
                <div className='header-wrap'>
                    <div className='badge'></div>
                    <div className='height'>
                        <SvgIcon aria-label="height" sx={{ padding: 0 }}>
                            <Height sx={{ height: 38, width: 38 }} />
                        </SvgIcon>
                        <span>{pokemonDetails?.height} M</span>
                    </div>
                    <div className='weight'>
                        <SvgIcon aria-label="weight" sx={{ padding: 0 }}>
                            <Weight sx={{ height: 38, width: 38 }} />
                        </SvgIcon>
                        <span>{pokemonDetails?.weight} LBS</span>
                    </div>
                </div>
                <CardContent sx={{ width: 182, height: 182, margin: "0 auto" }}>
                    <CardMedia
                        sx={{ maxWidth: "100%", width: "auto", height: "100%", margin: "0 auto" }}
                        component="img"
                        image={pokemonDetails?.sprites?.other?.dream_world?.front_default}
                        alt={pokemonName}
                    />
                </CardContent>
                <p className='name'>{ pokemonDetails?.name }</p>
                <p className='description'>{pokemonDesc }</p>
                </CardContent>
                </Link>
        </Card>
    );
}

export default PokemonCard;
