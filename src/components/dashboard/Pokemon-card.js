import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon, Grid, Button } from '@mui/material';
import { ArrowLeft, ArrowRight, Weight, Height } from "../../assets";
import { Link } from 'react-router-dom';
import { openDB, cacheData, getCachedData } from "../../utils/helpers/IndexedDBUtility";
import LinearProgress, {
    linearProgressClasses,
  } from "@mui/material/LinearProgress";
  import { styled } from '@mui/material/styles';

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

const PokemonCard = (props) => {
    const { pokemonName, classIdentifier } = props;
    const [combinePokemonDetailsData, setcombinePokemonDetailsData] = useState(null);

    const combinePokemonData = () => {
        openDB("PokeAPICache", 1)
            .then(async db => {
                const detailsFromCache = await getCachedData(db, 'combinePokemonDetails', pokemonName);
                if (detailsFromCache) {
                    setcombinePokemonDetailsData(detailsFromCache);
                } else {
                    const speciesResponse = fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`)
                        .then(response => response.json());
                    const detailsResponse = fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
                        .then(response_2 => response_2.json());

                    Promise.all([speciesResponse, detailsResponse])
                        .then(([speciesFromApi, detailsFromApi]) => {
                            const newCombinedData = {...speciesFromApi, ...detailsFromApi };
                            cacheData(db, "combinePokemonDetails", pokemonName, newCombinedData);
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
        combinePokemonData();
    }, [pokemonName]);

    const badge = combinePokemonDetailsData && Object.values(combinePokemonDetailsData.types).map(_ => _.type.name);
    const pokemonDescription = combinePokemonDetailsData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";

    return (combinePokemonDetailsData ? (
        <Card sx={{ height: classIdentifier !== "detail-section-left" ? 370 : "auto" }} className={classIdentifier}>
                {classIdentifier === "evolution-chain" ? (
                    <Link to={`/pokemon/${combinePokemonDetailsData?.name}`}>
                        <CardContent className="evolution-wrap" sx={{ width: 128, height: 128, margin: "0 auto" }} >
                            <CardMedia
                                sx={{ maxWidth: "100%", width: "auto", height: "100%", margin: "0 auto" }}
                                component="img"
                                image={combinePokemonDetailsData?.sprites?.other?.dream_world?.front_default}
                                alt={pokemonName}
                            />
                            <p className='name'>{ combinePokemonDetailsData?.name }</p>
                        </CardContent>
                    </Link>
                ) : classIdentifier === "detail-section-left" ? (
                    <CardContent>
                        <div className='header-wrap'>
                            <div className='badge'>
                                {badge.map((name, ind) => <span key={ind} className={ `type-${name}`}>{ name }</span>)}
                            </div>
                        </div>
                        <CardContent sx={{ width: 182, height: 182, margin: "0 auto" }}>
                            <CardMedia
                                sx={{ maxWidth: "100%", width: "auto", height: "100%", margin: "0 auto" }}
                                component="img"
                                image={combinePokemonDetailsData?.sprites?.other?.dream_world?.front_default}
                                alt={pokemonName}
                            />
                        </CardContent>
                        <div className='section-left-header-wrap'>
                            <div className='height'>
                                <SvgIcon aria-label="height" sx={{ padding: 0 }}>
                                    <Height sx={{ height: 38, width: 38 }} />
                                </SvgIcon>
                                <span>{combinePokemonDetailsData?.height} M</span>
                            </div>
                            <div className='weight'>
                                <SvgIcon aria-label="weight" sx={{ padding: 0 }}>
                                    <Weight sx={{ height: 38, width: 38 }} />
                                </SvgIcon>
                                <span>{combinePokemonDetailsData?.weight} LBS</span>
                            </div>
                        </div>
                        <p className='name'>{combinePokemonDetailsData?.name}</p>
                        <Grid
                            container
                            spacing={4}
                            columns={12}
                            className="flex justify-center items-center p-8"
                        >
                            {combinePokemonDetailsData?.stats.map((val, ind) => {
                                const statName = val.stat.name === "special-attack" ? "Sp.Attack" : val.stat.name === "special-defense" ? "Sp.Defense" : val.stat.name;
                                return(                                
                                    <Grid item xs={6} md={6} lg={6} xl={6} key={ind}>
                                        <div className='progress-textwrap'>
                                            <span className="float-left stat-name">{statName}</span>
                                            <div className="details-weight stat-val">
                                                <span>{val.base_stat}</span>
                                            </div>
                                        </div>
                                        <BorderLinearProgress variant="determinate" value={val.base_stat * 100 / 255} maxValue={100} />
                                    </Grid>
                                )
                            })}
                            </Grid>
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
                    </CardContent>
                ) : (                        
                <Link to={`/pokemon/${combinePokemonDetailsData?.name}`}>
                    <CardContent>
                        <div className='header-wrap'>
                            <div className='badge'>
                                {badge.map((name, ind) => <span key={ind} className={ `type-${name}`}>{ name }</span>)}
                            </div>
                            <div className='height'>
                                <SvgIcon aria-label="height" sx={{ padding: 0 }}>
                                    <Height sx={{ height: 38, width: 38 }} />
                                </SvgIcon>
                                <span>{combinePokemonDetailsData?.height} M</span>
                            </div>
                            <div className='weight'>
                                <SvgIcon aria-label="weight" sx={{ padding: 0 }}>
                                    <Weight sx={{ height: 38, width: 38 }} />
                                </SvgIcon>
                                <span>{combinePokemonDetailsData?.weight} LBS</span>
                            </div>
                        </div>
                        <CardContent sx={{ width: 182, height: 182, margin: "0 auto" }}>
                            <CardMedia
                                sx={{ maxWidth: "100%", width: "auto", height: "100%", margin: "0 auto" }}
                                component="img"
                                image={combinePokemonDetailsData?.sprites?.other?.dream_world?.front_default}
                                alt={pokemonName}
                            />
                        </CardContent>
                        <p className='name'>{combinePokemonDetailsData?.name}</p>
                        <p className='description'>{pokemonDescription}</p>
                    </CardContent>
                </Link>
            )}            
        </Card>
    ) : (
            <p>Loading...</p>
        )        
    );
}

export default PokemonCard;
