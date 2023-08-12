import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardMedia, CardContent, SvgIcon } from "@mui/material";
import { Weight, Height } from "../assets";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";
import { ArrowLeft, ArrowRight } from "../assets";

import Box from "@mui/material/Box";
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  width: 100,
  borderRadius: 5,
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
  const [details, setDetails] = useState(null);

  const openDB = async () => {
    const request = window.indexedDB.open("PokemonDB", 1);
    return new Promise((resolve, reject) => {
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("details")) {
          db.createObjectStore("details");
        }
        if (!db.objectStoreNames.contains("descriptions")) {
          db.createObjectStore("descriptions");
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getPokemonDetails = async () => {
    try {
      const db = await openDB();
      const tx = db.transaction(["details"], "readonly");
      const store = tx.objectStore("details");
      const cachedDataRequest = store.get(name);

      return new Promise((resolve, reject) => {
        cachedDataRequest.onsuccess = () => {
          resolve(cachedDataRequest.result);
        };
        cachedDataRequest.onerror = () => {
          reject(cachedDataRequest.error);
        };
      });
    } catch (error) {
      console.error("Error fetching data from IndexedDB:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const cachedDetails = await getPokemonDetails();
      if (cachedDetails) {
        setDetails(cachedDetails);
      } else {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
        const detailsFromApi = await response.json();
        setDetails(detailsFromApi);

        const db = await openDB();
        const tx = db.transaction(["details"], "readwrite");
        const store = tx.objectStore("details");
        store.put(detailsFromApi, name);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!details) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* Display other details as needed */}
      <Grid container spacing={2} columns={16}>
        <Grid item xs={16} sm={8} md={4} lg={4} xl={4}>
          <Card>
            <Link to={`/pokemon/${details?.name}`}>
              <CardContent sx={{ width: 278, height: 182, margin: "0 auto" }}>
                <CardMedia
                  sx={{
                    maxWidth: "100%",
                    width: "auto",
                    height: "100%",
                    margin: "0 auto",
                  }}
                  component="img"
                  image={details?.sprites?.other?.dream_world?.front_default}
                  alt={details.name}
                />
              </CardContent>
              <CardContent>
                <Grid container spacing={4} columns={16}>
                  <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                    <div className="details-height">
                      <SvgIcon aria-label="height" sx={{ padding: 0 }}>
                        <Height sx={{ height: 38, width: 38 }} />
                      </SvgIcon>
                      <span>{details?.height} M</span>
                    </div>
                  </Grid>
                  <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                    <div className="details-weight">
                      <SvgIcon aria-label="weight" sx={{ padding: 0 }}>
                        <Weight sx={{ height: 38, width: 38 }} />
                      </SvgIcon>
                      <span>{details?.weight} LBS</span>
                    </div>
                  </Grid>
                </Grid>
                <p className="name">{details?.name}</p>
              </CardContent>
            </Link>
            <Grid
              container
              spacing={4}
              columns={12}
              className="flex justify-center items-center p-8"
            >
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Hp</span>
                <div className="details-weight">
                  <span>56</span>
                </div>
                <BorderLinearProgress variant="determinate" value={56} />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Defence</span>
                <div className="details-weight">
                  <span>19</span>
                </div>
                <BorderLinearProgress variant="determinate" value={50} />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
              columns={12}
              className="flex justify-center items-center p-8"
            >
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Attack</span>
                <div className="details-weight">
                  <span>24</span>
                </div>
                <BorderLinearProgress variant="determinate" value={50} />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Speed</span>
                <div className="details-weight">
                  <span>32</span>
                </div>
                <BorderLinearProgress variant="determinate" value={50} />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
              columns={12}
              className="flex justify-center items-center p-8"
            >
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Sp.Attack</span>
                <div className="details-weight">
                  <span>310</span>
                </div>
                <BorderLinearProgress variant="determinate" value={50} />
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <span className="float-left">Sp.Defence</span>
                <div className="details-weight">
                  <span>270</span>
                </div>
                <BorderLinearProgress variant="determinate" value={50} />
              </Grid>
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
          </Card>
        </Grid>
        <Grid item xs={16} sm={8} md={12} lg={12} xl={12}>
          <Card sx={{ height: "100vh" }}>
            <CardContent>
              Content for the second grid item Three fourths of the screen
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default PokemonDetails;
