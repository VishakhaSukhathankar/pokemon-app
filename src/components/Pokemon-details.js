import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PokemonDetails = () => {
  const { name } = useParams();
    const [details, setDetails] = useState(null);

    const openDB = async () => {
        const request = window.indexedDB.open('PokemonDB', 1);
        return new Promise((resolve, reject) => {
            request.onupgradeneeded = event => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('details')) {
                    db.createObjectStore('details');
                }
                if (!db.objectStoreNames.contains('descriptions')) {
                    db.createObjectStore('descriptions');
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    const getPokemonDetails = async () => {
        try {
            const db = await openDB();
            const tx = db.transaction(['details'], 'readonly');
            const store = tx.objectStore('details');
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
            console.error('Error fetching data from IndexedDB:', error);
            return null;
        }
    };

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            const cachedDetails = await getPokemonDetails();
            if (cachedDetails) {
                setDetails(cachedDetails);
            } else {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
                const detailsFromApi = await response.json();
                setDetails(detailsFromApi);

                const db = await openDB();
                const tx = db.transaction(['details'], 'readwrite');
                const store = tx.objectStore('details');
                store.put(detailsFromApi, name);
            }
        };

        fetchPokemonDetails();
    }, [name]);

    if (!details) {
        return <p>Loading...</p>;
    }
  return (
    <div>
      <h1>{details.name}</h1>
      {/* Display other details as needed */}
    </div>
  );
}

export default PokemonDetails;
