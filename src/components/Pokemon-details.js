import React, { useState, useEffect } from 'react';
import { Box, Paper, Grid, Card, CardMedia, CardContent, SvgIcon, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { getCachedData, openDB, cacheData} from "../utils/helpers/IndexedDBUtility";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import EvoultionChain from './evolution/evolution-chain';
import "./styles.scss";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { ArrowLeft, ArrowRight, Weight, Height } from "../assets";
import PokemonCard from './dashboard/Pokemon-card';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 5,
    width: 120,
    borderRadius: 5,
    marginTop: 6,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#EE3F3E" : "#EE3F3E",
    },
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
    const statsDetails = combinePokemonDetailsData?.stats.map((val, ind) => val.stat.name)
    console.log(statsDetails, "statsDetails")
    console.log(combinePokemonDetailsData, "combinePokemonDetailsData")
    return (combinePokemonDetailsData ? (
        <section>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} columns={16}>
                    <Grid item xs={16} sm={8} md={4} lg={4} xl={4}>
                        <Card>
                            <PokemonCard pokemonName={combinePokemonDetailsData?.name} classIdentifier="detail-section-left"/>
                            <div className="pagination">
                                <Button
                                    // disabled={pageNumber <= 0}
                                    // onClick={handlePrevClick}
                                    variant="contained"
                                >
                                    <span className="arw-left">
                                    <ArrowLeft />
                                    </span>{" "}
                                    Prev
                                </Button>
                                <Button
                                    // onClick={handleNextClick}
                                    variant="contained"
                                >
                                    Next{" "}
                                    <span className="arw-right">
                                    <ArrowRight />
                                    </span>
                                </Button>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={16} sm={8} md={12} lg={12} xl={12}>
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
