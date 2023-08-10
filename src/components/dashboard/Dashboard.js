import React, { useState, useEffect } from 'react';
import { Grid, Paper } from '@mui/material';
import PokemonCard from './Pokemon-card';
import "./styles.scss"

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [pokemonDetails, setPokemonDetails] = useState([]);
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=8&offset=8").then(res => res.json()).then(response => {
            setData(response.results);
        })
    }, []);
    return (
        <div className='wrapper'>
            <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
                {Object.values(data).map(_ => <Grid item xs={3}><PokemonCard pokemonName={ _.name} /></Grid>)}
            </Grid>
        </div>
    )
}

export default Dashboard;