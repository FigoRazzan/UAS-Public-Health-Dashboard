// IndexedDB helper for caching COVID data
const DB_NAME = 'CovidDataCache';
const STORE_NAME = 'covidData';
const DB_VERSION = 1;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export interface CachedData {
  timestamp: number;
  data: any[];
}

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
};

export const getCachedData = async (): Promise<CachedData | null> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('covidData');

      request.onsuccess = () => {
        const cached = request.result as CachedData | undefined;
        
        // Check if cache exists and is not expired
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          console.log('Using cached data from IndexedDB');
          resolve(cached);
        } else {
          console.log('Cache expired or not found');
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

export const setCachedData = async (data: any[]): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const cachedData: CachedData = {
        timestamp: Date.now(),
        data: data,
      };
      const request = store.put(cachedData, 'covidData');

      request.onsuccess = () => {
        console.log('Data cached successfully in IndexedDB');
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error caching data:', error);
  }
};

export const clearCache = async (): Promise<void> => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('Cache cleared');
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
