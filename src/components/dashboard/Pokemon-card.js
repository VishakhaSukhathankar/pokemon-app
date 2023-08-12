import React, { useState, useEffect } from 'react';
import { Card, CardMedia, CardContent, SvgIcon } from '@mui/material';
import { Weight, Height } from "../../assets";
import { Link } from 'react-router-dom';
import { openDB, cacheData, getCachedData } from "../../utils/helpers/IndexedDBUtility";

const PokemonCard = (props) => {
    const { pokemonName, evolutionClass } = props;
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

    if (!combinePokemonDetailsData) {
        return <p>Loading...</p>;
    }
    const badge = Object.values(combinePokemonDetailsData?.types)?.map(_ => _.type.name);
    const pokemonDescription = combinePokemonDetailsData?.flavor_text_entries?.find(entry => entry.language.name === "en")?.flavor_text || "";
    return (
        <Card sx={{ height: 370 }} className={evolutionClass}>
            <Link to={`/pokemon/${combinePokemonDetailsData?.name}`}>
                {evolutionClass === "evolution-chain" ? (
                    <CardContent className="evolution-wrap" sx={{ width: 128, height: 128, margin: "0 auto" }}>
                        <CardMedia
                            sx={{ maxWidth: "100%", width: "auto", height: "100%", margin: "0 auto" }}
                            component="img"
                            image={combinePokemonDetailsData?.sprites?.other?.dream_world?.front_default}
                            alt={pokemonName}
                        />
                        <p className='name'>{ combinePokemonDetailsData?.name }</p>
                    </CardContent>
                ) : (
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
                    <p className='name'>{ combinePokemonDetailsData?.name }</p>
                    <p className='description'>{ pokemonDescription }</p>
                </CardContent>
                )}
                
            </Link>
        </Card>
    );
}

export default PokemonCard;
