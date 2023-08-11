import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PokemonDetails = () => {
  const { name } = useParams();
  const [details, setDetails] = useState(null);

  const openDB = async () => {
    const request = window.indexedDB.open('PokemonDetails', 1);
    return new Promise((resolve, reject) => {
      request.onupgradeneeded = event => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('PokemonCache')) {
          db.createObjectStore('PokemonCache');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getPokemonDetails = async (pokemonName) => {
    try {
      const db = await openDB();
      const tx = db.transaction(['PokemonCache'], 'readonly');
      const store = tx.objectStore('PokemonCache');
      const cachedDataRequest = store.get(pokemonName);

      return new Promise((resolve, reject) => {
        cachedDataRequest.onsuccess = () => {
          resolve(cachedDataRequest.result);
        };
        cachedDataRequest.onerror = () => {
          reject(cachedDataRequest.error);
        };
      });
    } catch (error) {
      console.error('Error fetching data from IndexedDB:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      const cachedDetails = await getPokemonDetails(name);
      if (cachedDetails) {
        setDetails(cachedDetails);
      } else {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const detailsFromApi = await response.json();
        setDetails(detailsFromApi);

        const db = await openDB();
        const tx = db.transaction(['PokemonCache'], 'readwrite');
        const store = tx.objectStore('PokemonCache');
        store.put(detailsFromApi, name);
      }
    };

    fetchPokemonDetails();
  }, [name]);

  if (!details) {
    return <p>Loading...</p>;
  }
    
    console.log(details, "details")

  return (
    <div>
      <h1>{details.name}</h1>
    </div>
  );
}

export default PokemonDetails;
