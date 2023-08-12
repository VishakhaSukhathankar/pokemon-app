import PokemonCard from "../dashboard/Pokemon-card";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const EvoultionChain = (props) => {
    return <>
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                {props.name.map((name, ind) => <Grid key={ind} item xs={3}><PokemonCard classIdentifier="evolution-chain" pokemonName={name}/></Grid>)}                
            </Grid>
        </Box>               
    </>;
}

export default EvoultionChain;