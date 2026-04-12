import { Injectable } from '@angular/core';
import { IndexeddbService, Autor } from './indexeddb';

@Injectable({ providedIn: 'root' })
export class AutoresService {
  constructor(private db: IndexeddbService) {}

  getAll(): Promise<Autor[]> {
    return this.db.getAll<Autor>('autores');
  }

  getById(id: number): Promise<Autor> {
    return this.db.getById<Autor>('autores', id);
  }

  create(autor: Autor): Promise<number> {
    return this.db.add<Autor>('autores', autor);
  }

  update(autor: Autor): Promise<void> {
    return this.db.update<Autor>('autores', autor);
  }

  delete(id: number): Promise<void> {
    return this.db.delete('autores', id);
  }
}