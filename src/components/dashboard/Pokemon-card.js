import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon } from '@mui/material';
import { Weight, Height } from "../../assets";

// Cache for Pokemon details and descriptions
const pokemonCache = {};

const PokemonCard = ({ pokemonName }) => {
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [pokemonDesc, setPokemonDesc] = useState(null);

    useEffect(() => {
        if (pokemonCache[pokemonName]) {
            // Use cached data if available
            setPokemonDetails(pokemonCache[pokemonName].details);
            setPokemonDesc(pokemonCache[pokemonName].desc);
        } else {
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
                .then(res => res.json())
                .then(response => {
                    setPokemonDetails(response);
                    // Cache the fetched details
                    pokemonCache[pokemonName] = { details: response, desc: null };
                });
        }
    }, [pokemonName]);

    useEffect(() => {
        if (pokemonCache[pokemonName]?.desc) {
            // Use cached description if available
            setPokemonDesc(pokemonCache[pokemonName].desc);
        } else {
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
                .then(res => res.json())
                .then(response => {
                    const description = response?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
                    setPokemonDesc(description);
                    // Cache the fetched description
                    if (pokemonCache[pokemonName]) {
                        pokemonCache[pokemonName].desc = description;
                    } else {
                        pokemonCache[pokemonName] = { details: null, desc: description };
                    }
                });
        }
    }, [pokemonName]);

    if (!pokemonDetails || !pokemonDesc) {
        // Add a loading state while data is being fetched
        return <p>Loading...</p>;
    }

    // Rest of the component remains the same
    return (
        <Card sx={{ height: 370 }}>
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
        </Card>
    );
}

export default PokemonCard;
