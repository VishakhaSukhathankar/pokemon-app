import PokemonCard from "../dashboard/Pokemon-card";

const EvoultionChain = (props) => {
    return <>
        <PokemonCard evolutionClass="evolution-chain" pokemonName={props.name}/>
    </>;
}

export default EvoultionChain;