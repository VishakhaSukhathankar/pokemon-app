import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon } from '@mui/material';
import { Weight, Height } from "../../assets";
import { Link } from 'react-router-dom';
import { cacheEndpointData } from "../../utils/helpers/IndexedDBUtility";

const dbName = 'PokeAPICache';
const version = 1;

const PokemonCard = (props) => {
    console.log(props, "props")
    const { pokemonName, evolutionClass } = props;
    const [pokemonDetails, setPokemonDetails] = useState(null);
    const [pokemonDesc, setPokemonDesc] = useState(null);

    const getPokemonDetails = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const details = await response.json();
            setPokemonDetails(details);
            return details;
        } catch (error) {
            console.error('Error fetching new data:', error);
            throw error;
        }
    };

    const getPokemonDescription = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
            const newData = await response.json();
            const description = newData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
            setPokemonDesc(description)
            return description;
        } catch (error) {
            console.error('Error fetching new data:', error);
            throw error;
        }
    };

    useEffect(() => {
        cacheEndpointData(dbName, version, 'descriptions', pokemonName , getPokemonDescription);
        cacheEndpointData(dbName, version, 'details', pokemonName, getPokemonDetails);
    }, [pokemonName]);

    if (!pokemonDetails || !pokemonDesc) {
        return <p>Loading...</p>;
    }

    return (
        <Card sx={{ height: 370 }} className={evolutionClass}>
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
