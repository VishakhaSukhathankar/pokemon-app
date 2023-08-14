import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getCachedData, openDB, cacheData} from "../utils/helpers/IndexedDBUtility";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EvoultionChain from './evolution/evolution-chain';
import PokemonCard from './dashboard/Pokemon-card';
import { ArrowLeft, ArrowRight } from "../assets";
import "./styles.scss";

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const PokemonDetails = () => {
    const { name, id } = useParams();
    const [evolutionChain, setevolutionChain] = useState(null);
    const [combinePokemonDetailsData, setcombinePokemonDetailsData] = useState(null);
    const [pokemonIdDetails, setPokemonIdDetails] = useState(id);
    console.log(name, "name")

    const combinePokemonData = () => {
        openDB("PokeAPICache", 1)
            .then(async db => {
                const detailsFromCache = await getCachedData(db, 'combinePokemonDetails', pokemonIdDetails);
                if (detailsFromCache) {
                    setcombinePokemonDetailsData(detailsFromCache);
                } else {
                    const speciesResponse = fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonIdDetails}`)
                        .then(response => response.json());
                    const detailsResponse = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdDetails}`)
                        .then(response_2 => response_2.json());

                    Promise.all([speciesResponse, detailsResponse])
                        .then(([speciesFromApi, detailsFromApi]) => {
                            const newCombinedData = {...speciesFromApi, ...detailsFromApi };
                            cacheData(db, "combinePokemonDetails", pokemonIdDetails, newCombinedData);
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
    }, [name, pokemonIdDetails]);

    useEffect(() => {
        const endpoint = combinePokemonDetailsData?.evolution_chain?.url;
        fetch(endpoint).then(res => res.json()).then(response => setevolutionChain(response))
    }, [combinePokemonDetailsData?.evolution_chain?.url], pokemonIdDetails, name)

    const eggGroup = combinePokemonDetailsData?.egg_groups?.map(_ => _.name).join("  ");
    const abilities = combinePokemonDetailsData?.abilities?.map(_ => _.ability.name).join("  ");
    const storyDetail = combinePokemonDetailsData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
    function extractSpeciesNames(obj, result = []) {
        console.log(obj, "obj")
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
    console.log(combinePokemonDetailsData, "combinePokemonDetailsData")
    return (combinePokemonDetailsData ? (
        <section className='pokemon-detail-page'>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16} sm={8} md={4} lg={4} xl={4}>
                        <PokemonCard pokemonName={combinePokemonDetailsData?.name} classIdentifier="detail-section-left" />                        
                        <div className="pagination">
                        <Link to={`/pokemon-app/pokemon/${combinePokemonDetailsData?.name}/${pokemonIdDetails}`}>
                                <Button variant="contained" onClick={() => setPokemonIdDetails(+pokemonIdDetails - 1)}>
                                    <span className="arw-left">
                                        <ArrowLeft />
                                    </span>
                                    {` Prev #${String(+pokemonIdDetails - 1).padStart(4, '0')}`}
                                </Button>
                            </Link>
                            <Link to={`/pokemon-app/pokemon/${combinePokemonDetailsData?.name}/${pokemonIdDetails}`}>
                                <Button variant="contained" onClick={() => setPokemonIdDetails(+pokemonIdDetails + 1)}>
                                    {`Next #${String(+pokemonIdDetails + 1).padStart(4, '0')}`}
                                    <span className="arw-right">
                                        <ArrowRight />
                                    </span>
                                </Button>
                            </Link>
                        </div>
                    </Grid>
                    <Grid item xs={16} sm={8} md={12} lg={12} xl={12}>
                        <Item className='pokemon-details'>
                            <div className='detail-wrap'>
                                    <h3 className='detail-title'>Versions</h3>
                                    <div className='version-details'>
                                    {allSpeciesNames.map((name, ind) => {
                                        const currentPokemonId = combinePokemonDetailsData
                                        console.log(currentPokemonId, "currentPokemonId")
                                        return <Link key={ind} onClick={() => setPokemonIdDetails(combinePokemonDetailsData?.id)} to={`/pokemon-app/pokemon/${name}/${combinePokemonDetailsData?.id}`}><p className='detail-desc'>{name}</p></Link>
                                    })}
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
                                <p className='detail-desc'>{ combinePokemonDetailsData?.capture_rate}%</p>
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
