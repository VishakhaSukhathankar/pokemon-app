import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getCachedData, openDB, cacheData} from "../utils/helpers/IndexedDBUtility";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EvoultionChain from './evolution/evolution-chain';
import "./styles.scss";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PokemonDetails = () => {
    const { name } = useParams();
    const [evolutionChain, setevolutionChain] = useState(null);
    const [combinePokemonDetailsData, setcombinePokemonDetailsData] = useState(null);

    const combinePokemonData = () => {
        openDB("PokeAPICache", 1)
            .then(async db => {
                const detailsFromCache = await getCachedData(db, 'combinePokemonDetails', name);
                if (detailsFromCache) {
                    setcombinePokemonDetailsData(detailsFromCache);
                } else {
                    const speciesResponse = fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
                        .then(response => response.json());
                    const detailsResponse = fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
                        .then(response_2 => response_2.json());

                    Promise.all([speciesResponse, detailsResponse])
                        .then(([speciesFromApi, detailsFromApi]) => {
                            const newCombinedData = {...speciesFromApi, ...detailsFromApi };
                            cacheData(db, "combinePokemonDetails", name, newCombinedData);
                            setcombinePokemonDetailsData(detailsFromApi);
                        })
                        .catch(error => {
                            console.error('Error fetching data:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error opening DB:', error);
            });
    };

    useEffect(() => {
        combinePokemonData()
    }, [name]);

    useEffect(() => {
        const endpoint = combinePokemonDetailsData?.evolution_chain?.url;
        fetch(endpoint).then(res => res.json()).then(response => setevolutionChain(response))
    }, [combinePokemonDetailsData?.evolution_chain?.url])

    const eggGroup = combinePokemonDetailsData?.egg_groups?.map(_ => _.name).join(", ");
    const abilities = combinePokemonDetailsData?.abilities?.map(_ => _.ability.name).join(", ");
    const storyDetail = combinePokemonDetailsData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
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
    return (combinePokemonDetailsData ? (
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
                                        {allSpeciesNames.map((name, ind)=> <Link key={ind} to={`/pokemon/${name}`}><p className='detail-desc'>{name}</p></Link>)}
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
                                <p className='detail-desc'>{ combinePokemonDetailsData?.capture_rate} %</p>
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
    ) : (
        <p>Loading...</p>   
    )
    
    );
}

export default PokemonDetails;
