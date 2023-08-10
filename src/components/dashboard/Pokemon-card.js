import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon } from '@mui/material';
import {Weight, Height} from "../../assets";

const PokemonCard = ({pokemonName}) => {
    const [pokemonDetails, setPokemonDetails] = useState([]);
    const [pokemonDesc, setpokemonDesc] = useState([]);
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(res => res.json()).then(response => {
            setPokemonDetails(response);
        })
    }, []);
    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`).then(res => res.json()).then(response => {
            setpokemonDesc(response?.flavor_text_entries?.filter(_ => _.language.name === "en").map(_ => _.flavor_text)[0].toString());
        })
    }, []);
    console.log(pokemonDetails, "pokemonDetails");
    console.log(pokemonDesc, "pokemonDesc");
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
    )
}

export default PokemonCard;