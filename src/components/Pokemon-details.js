import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Button } from "@mui/material";
import { useParams } from "react-router-dom";
import {
  getCachedData,
  openDB,
  cacheData,
} from "../utils/helpers/IndexedDBUtility";
import { Link } from "react-router-dom";
import EvoultionChain from "./evolution/evolution-chain";
import PokemonCard from "./dashboard/Pokemon-card";
import { ArrowLeft, ArrowRight, DarkArrowRight, DarkArrowLeft } from "../assets";
import classnames from "classnames";
import "./styles.scss";

const PokemonDetails = ({ isDark }) => {
  console.log(isDark, "isDark")
  const { name, id } = useParams();
  const [evolutionChain, setevolutionChain] = useState(null);
  const [combinePokemonDetailsData, setcombinePokemonDetailsData] =
    useState(null);
  const [pokemonIdDetails, setPokemonIdDetails] = useState(id);
  console.log(name, "name");

  const combinePokemonData = () => {
    openDB("PokeAPICache", 2)
      .then(async (db) => {
        const detailsFromCache = await getCachedData(
          db,
          "combinepokemondetails",
          pokemonIdDetails
        );
        if (detailsFromCache) {
          setcombinePokemonDetailsData(detailsFromCache);
        } else {
          const speciesResponse = fetch(
            `https://pokeapi.co/api/v2/pokemon-species/${pokemonIdDetails}`
          ).then((response) => response.json());
          const detailsResponse = fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonIdDetails}`
          ).then((response_2) => response_2.json());

          Promise.all([speciesResponse, detailsResponse])
            .then(([speciesFromApi, detailsFromApi]) => {
              const newCombinedData = { ...speciesFromApi, ...detailsFromApi };
              cacheData(
                db,
                "combinepokemondetails",
                pokemonIdDetails,
                newCombinedData
              );
              setcombinePokemonDetailsData(detailsFromApi);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        }
      })
      .catch((error) => {
        console.error("Error opening DB:", error);
      });
  };

  useEffect(() => {
    combinePokemonData();
  }, [name, pokemonIdDetails]);

  useEffect(
    () => {
      const endpoint = combinePokemonDetailsData?.evolution_chain?.url;
      fetch(endpoint)
        .then((res) => res.json())
        .then((response) => setevolutionChain(response));
    },
    [combinePokemonDetailsData?.evolution_chain?.url],
    pokemonIdDetails,
    name
  );

  const eggGroup = combinePokemonDetailsData?.egg_groups
    ?.map((_) => _.name)
    .join("  ");
  const abilities = combinePokemonDetailsData?.abilities
    ?.map((_) => _.ability.name)
    .join("  ");
  const storyDetail =
    combinePokemonDetailsData?.flavor_text_entries?.find(
      (entry) => entry.language.name === "en"
    )?.flavor_text || "";
  function extractSpeciesNames(obj, result = []) {
    console.log(obj, "obj");
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
  console.log(combinePokemonDetailsData, "combinePokemonDetailsData");
  return combinePokemonDetailsData ? (
    <section className="pokemon-detail-page">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} columns={16}>
          <Grid item xs={16} sm={8} md={4} lg={4} xl={4} sx={{ flexDirection: { xs: "column", md: "row"} }}>
            <PokemonCard
              pokemonName={combinePokemonDetailsData?.name}
              classIdentifier="detail-section-left"
              isDark={isDark}
            />
            <div className={classnames("pagination",{
                    "pagination-dark" : isDark
                  })}>
              <Link
                to={`/pokemon-app/pokemon/${combinePokemonDetailsData?.name}/${pokemonIdDetails}`}
              >
                <Button
                  variant="contained"
                  onClick={() => setPokemonIdDetails(+pokemonIdDetails - 1)}
                >
                  <span className="arw-left">
                  {isDark ? <DarkArrowLeft/> : <ArrowLeft />}
                  </span>
                  {` Prev #${String(+pokemonIdDetails - 1).padStart(4, "0")}`}
                </Button>
              </Link>
              <Link
                to={`/pokemon-app/pokemon/${combinePokemonDetailsData?.name}/${pokemonIdDetails}`}
              >
                <Button
                  variant="contained"
                  onClick={() => setPokemonIdDetails(+pokemonIdDetails + 1)}
                >
                  {`Next #${String(+pokemonIdDetails + 1).padStart(4, "0")}`}
                  <span className="arw-right">
                    {isDark ? <DarkArrowRight/> : <ArrowRight />}
                  </span>
                </Button>
              </Link>
            </div>
          </Grid>
          <Grid item xs={16} sm={8} md={12} lg={12} xl={12}>
            <Paper
              className="pokemon-details"
              sx={{ background: isDark ? "#333333" : "#ffffff" }}
            >
              <div className="detail-wrap">
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Versions</h3>
                <div className="version-details">
                  {allSpeciesNames.map((name, ind) => {
                    const currentPokemonId = combinePokemonDetailsData;
                    console.log(currentPokemonId, "currentPokemonId");
                    return (
                      <Link
                        key={ind}
                        onClick={() =>
                          setPokemonIdDetails(combinePokemonDetailsData?.id)
                        }
                        to={`/pokemon-app/pokemon/${name}/${combinePokemonDetailsData?.id}`}
                      >
                        <p className={classnames("detail-desc",{
                          "detail-desc-dark" : isDark
                        })}>{name}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div
                className="detail-wrap"
                sx={{ background: isDark ? "#333333" : "#ffffff" }}
              >
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Story</h3>
                <p className={classnames("detail-desc",{
                    "detail-desc-dark" : isDark
                  })}></p>
              </div>
              <div className="detail-wrap">
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Abilities</h3>
                <p className={classnames("detail-desc",{
                    "detail-desc-dark" : isDark
                  })}>{abilities}</p>
              </div>
              <div className="detail-wrap">
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Catch Rate</h3>
                <p className={classnames("detail-desc",{
                    "detail-desc-dark" : isDark
                  })}>
                  {combinePokemonDetailsData?.capture_rate}%
                </p>
              </div>
              <div className="detail-wrap">
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Egg group</h3>
                <p className={classnames("detail-desc",{
                    "detail-desc-dark" : isDark
                  })}>{eggGroup}</p>
              </div>
              <div className="detail-wrap">
                <h3 className={classnames("detail-title",{
                    "detail-title-dark" : isDark
                  })}>Evolution</h3>
                <EvoultionChain name={allSpeciesNames} isDark={isDark} />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </section>
  ) : (
    <p>Loading...</p>
  );
};

export default PokemonDetails;
