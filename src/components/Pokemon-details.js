import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getCachedData, cacheEndpointData, openDB} from "../utils/helpers/IndexedDBUtility";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import "./styles.scss"
import EvoultionChain from './evolution/evolution-chain';
import { Link } from 'react-router-dom';


const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PokemonDetails = () => {
    const { name } = useParams();
    const [details, setDetails] = useState(null);
    const [speciesDetails, setSpeciesDetails] = useState(null);
    const [evolutionChain, setevolutionChain] = useState(null);
    const dbName = 'PokeAPICache';
    const version = 1;
    const fetchData = async () => {
        try {            
            const db = await openDB("PokeAPICache", 1);
            const detailsFromCache = await getCachedData(db, 'details', name);
            if (detailsFromCache) {
                setDetails(detailsFromCache);
            } else {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const detailsFromApi = await response.json();
                setDetails(detailsFromApi);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const getSpeciesDetails = async () => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
            const newData = await response.json();
            setSpeciesDetails(newData);
            return newData;
        } catch (error) {
            console.error('Error fetching new data:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchData();
        getSpeciesDetails()
        cacheEndpointData(dbName, version, 'speciesDetails', name, getSpeciesDetails);
    }, [name]);

    useEffect(() => {
        const endpoint = speciesDetails?.evolution_chain?.url;
        fetch(endpoint).then(res => res.json()).then(response => setevolutionChain(response))
    }, [speciesDetails?.evolution_chain?.url])

    if (!details) {
        return <p>Loading...</p>;
    }
    const eggGroup = speciesDetails?.egg_groups?.map(_ => _.name).join(", ");
    const abilities = details?.abilities?.map(_ => _.ability.name).join(", ");
    const storyDetail = speciesDetails?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
    function extractSpeciesNames(obj, result = []) {
        if (obj?.species && obj?.species?.name) {
          result.push(obj?.species?.name);
        }
        if (obj?.evolves_to && obj?.evolves_to.length > 0) {
          for (const evolveObj of obj?.evolves_to) {
            extractSpeciesNames(evolveObj, result);
          }
        }
        return result;
      }
      const allSpeciesNames = extractSpeciesNames(evolutionChain?.chain);      
    return (
    <section>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                    <Item>xs=8</Item>
                </Grid>
                <Grid item xs={8}>
                    <Item className='pokemon-details'>
                        <div className='detail-wrap'>
                                <h3 className='detail-title'>Versions</h3>
                                <div className='version-details'>
                                    {allSpeciesNames.map((name, ind)=> <Link to={`/pokemon/${name}`}><p className='detail-desc'>{name}</p></Link>)}
                                </div>
                        </div>
                        <div className='detail-wrap'>
                            <h3 className='detail-title'>Story</h3>
                            <p className='detail-desc'>{storyDetail}</p>
                        </div>
                        <div className='detail-wrap'>
                            <h3 className='detail-title'>Abilities</h3>
                            <p className='detail-desc'>{ abilities }</p>
                        </div>
                        <div className='detail-wrap'>
                            <h3 className='detail-title'>Catch Rate</h3>
                            <p className='detail-desc'>{ speciesDetails?.capture_rate} %</p>
                        </div>
                        <div className='detail-wrap'>
                            <h3 className='detail-title'>Egg group</h3>
                            <p className='detail-desc'>{ eggGroup }</p>
                        </div>
                        <div className='detail-wrap'>
                            <h3 className='detail-title'>Evolution</h3>
                            <EvoultionChain name={allSpeciesNames}/>
                        </div>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    </section>
    );
}

export default PokemonDetails;
