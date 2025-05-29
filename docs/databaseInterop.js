export async function openDb(dbName, storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = function (event) {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveItem(dbName, storeName, item) {
  const db = await openDb(dbName, storeName);
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);

    const request = store.put(item);

    request.onsuccess = () => {
      resolve(true);
    };
    request.onerror = () => {
      reject(request.error);
    };

    tx.onerror = () => {
      reject(tx.error);
    };
  });
}

export async function getAllItems(dbName, storeName) {
  const db = await openDb(dbName, storeName);
  const tx = db.transaction(storeName, 'readonly');
  const store = tx.objectStore(storeName);
  const req = store.getAll();

  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteItem(dbName, storeName, id) {
  const db = await openDb(dbName, storeName);
  const tx = db.transaction(storeName, 'readwrite');
  const store = tx.objectStore(storeName);
  store.delete(id);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function deleteDb(dbName) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(dbName);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

export function parseJson(text) {
  return JSON.parse(text);
}

export function toJson(obj) {
  return JSON.stringify(obj);
}
