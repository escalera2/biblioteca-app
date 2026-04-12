import { Injectable } from '@angular/core';
import { IndexeddbService, Libro } from './indexeddb';

@Injectable({ providedIn: 'root' })
export class LibrosService {
  constructor(private db: IndexeddbService) {}

  getAll(): Promise<Libro[]> {
    return this.db.getAll<Libro>('libros');
  }

  getById(id: number): Promise<Libro> {
    return this.db.getById<Libro>('libros', id);
  }

  getByAutor(autorId: number): Promise<Libro[]> {
    return this.db.getByIndex<Libro>('libros', 'autorId', autorId);
  }

  create(libro: Libro): Promise<number> {
    return this.db.add<Libro>('libros', libro);
  }

  update(libro: Libro): Promise<void> {
    return this.db.update<Libro>('libros', libro);
  }

  delete(id: number): Promise<void> {
    return this.db.delete('libros', id);
  }
}