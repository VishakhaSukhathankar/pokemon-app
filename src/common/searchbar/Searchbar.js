import React, { useEffect, useState } from "react";
import Ball from "../../assets/Ball.png";
import "./styles.scss";

const SearchBar = () => {
  const [pokemonName, setPokemonName] = useState("");
  const [searchedPokemonDetails, setSearchedPokemonDetails] = useState(null);
  const openDB = async () => {
    const request = window.indexedDB.open("PokemonName", 1);

    return new Promise((resolve, reject) => {
      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains("pokemonNameDetails")) {
          db.createObjectStore("pokemonNameDetails");
        }
      };

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => reject(request.error);
    });
  };
  const handlePokemonSearch = (evt) => {
    evt.preventDefault();
    // console.log("Pokemon Data->>>", pokemonName);

    setPokemonName("");
  };
  const handleSearchInputChange = (event) => {
    setPokemonName(event.target.value);
  };
 
  const fetchDetailsAndCache = async () => {
    try {
    const db = await openDB()
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=1290&offset=0`
      );
      const details = await response.json();
      setSearchedPokemonDetails(details);
      const abc = Object.values(details.results).map((val)=>val.name)
      // console.log('abc->>>>',abc)
      const tx = db.transaction(["pokemonNameDetails"], "readwrite");
      const store = tx.objectStore("pokemonNameDetails");
      store.put(abc, "pokemonName");
      // console.log(store);
    } catch (error) {
      console.error("Error fetching details from API:", error);
    }
  };
  useEffect(() => {
    fetchDetailsAndCache();
  }, []);
  return (
    <div>
      <form onSubmit={handlePokemonSearch}>
        <div className="grid grid-flow-col auto-cols-max">
          <input
            type="text"
            className="searchbox"
            placeholder="Use the Advanced Search to explore Pokémon"
            value={pokemonName}
            onChange={handleSearchInputChange}
          />
          <div className="ballContainer">
            <button type="submit">
              <img
                src={Ball}
                alt="Pokemon Ball"
                width="40.02"
                height="40"
              ></img>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SearchBar;
