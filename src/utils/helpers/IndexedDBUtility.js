const openDB = async (dbName, version) => {
  const request = window.indexedDB.open(dbName, version);
  return new Promise((resolve, reject) => {
      request.onupgradeneeded = event => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('details')) {
              db.createObjectStore('details');
          }
          if (!db.objectStoreNames.contains('descriptions')) {
              db.createObjectStore('descriptions');
          }
          if (!db.objectStoreNames.contains('pokemonData')) {
            db.createObjectStore('pokemonData');
          }
          if (!db.objectStoreNames.contains('speciesDetails')) {
            db.createObjectStore('speciesDetails');
          }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
  });
};

const cacheData = async (db, objectStoreName, key, dataToCache) => {
  const tx = db.transaction([objectStoreName], 'readwrite');
  const store = tx.objectStore(objectStoreName);
  store.put(dataToCache, key);
  await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
  });
};

const getCachedData = async (db, objectStoreName, key) => {
  const tx = db.transaction([objectStoreName], 'readonly');
  const store = tx.objectStore(objectStoreName);
  const cachedDataRequest = store.get(key);

  return new Promise((resolve, reject) => {
      cachedDataRequest.onsuccess = () => {
        resolve(cachedDataRequest.result);
      };
      cachedDataRequest.onerror = () => {
          reject(cachedDataRequest.error);
      };
  });
};


const cacheEndpointData = async (dbName, version, objectStoreName, key, fetchFunction) => {
  try {
      const db = await openDB(dbName, version);
      const cachedData = await getCachedData(db, objectStoreName, key);

      if (!cachedData) {
          const newData = await fetchFunction();
          if (newData) {
              await cacheData(db, objectStoreName, key, newData);
          }
      }
  } catch (error) {
      console.error('Error caching endpoint data:', error);
  }
};

export { openDB, getCachedData, cacheData, cacheEndpointData };
