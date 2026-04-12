import { Injectable } from '@angular/core';

export interface Autor {
  id?: number;
  nombre: string;
  apellido: string;
  nacionalidad: string;
  fechaNacimiento: string;
  biografia: string;
}

export interface Libro {
  id?: number;
  titulo: string;
  isbn: string;
  anioPublicacion: number;
  genero: string;
  descripcion: string;
  autorId: number;
  disponible: boolean;
}

@Injectable({ providedIn: 'root' })
export class IndexeddbService {
  private dbName = 'BibliotecaDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async initDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

      
        if (!db.objectStoreNames.contains('autores')) {
          const autoresStore = db.createObjectStore('autores', {
            keyPath: 'id',
            autoIncrement: true
          });
          autoresStore.createIndex('nombre', 'nombre', { unique: false });
        }


        if (!db.objectStoreNames.contains('libros')) {
          const librosStore = db.createObjectStore('libros', {
            keyPath: 'id',
            autoIncrement: true
          });
          librosStore.createIndex('autorId', 'autorId', { unique: false });
          librosStore.createIndex('titulo', 'titulo', { unique: false });
        }
      };
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getById<T>(storeName: string, id: number): Promise<T> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async add<T>(storeName: string, item: T): Promise<number> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.add(item);
      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, item: T): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: number): Promise<void> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await this.initDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}