import { Injectable } from '@angular/core';
import { IndexeddbService, Prestamo, Libro } from './indexeddb';

@Injectable({ providedIn: 'root' })
export class PrestamosService {
  constructor(private db: IndexeddbService) {}

  getAll(): Promise<Prestamo[]> {
    return this.db.getAll<Prestamo>('prestamos');
  }

  getById(id: number): Promise<Prestamo> {
    return this.db.getById<Prestamo>('prestamos', id);
  }

  getByLibro(libroId: number): Promise<Prestamo[]> {
    return this.db.getByIndex<Prestamo>('prestamos', 'libroId', libroId);
  }

  getByEstado(estado: string): Promise<Prestamo[]> {
    return this.db.getByIndex<Prestamo>('prestamos', 'estado', estado);
  }


  async create(prestamo: Prestamo): Promise<number> {
    const id = await this.db.add<Prestamo>('prestamos', prestamo);
    const libro = await this.db.getById<Libro>('libros', prestamo.libroId);
    if (libro) {
      await this.db.update<Libro>('libros', { ...libro, disponible: false });
    }
    return id;
  }


  async devolver(prestamo: Prestamo): Promise<void> {
    await this.db.update<Prestamo>('prestamos', {
      ...prestamo,
      estado: 'devuelto'
    });
    const libro = await this.db.getById<Libro>('libros', prestamo.libroId);
    if (libro) {
      await this.db.update<Libro>('libros', { ...libro, disponible: true });
    }
  }

  update(prestamo: Prestamo): Promise<void> {
    return this.db.update<Prestamo>('prestamos', prestamo);
  }


  async delete(id: number): Promise<void> {
    const prestamo = await this.db.getById<Prestamo>('prestamos', id);
    if (prestamo && prestamo.estado === 'activo') {
      const libro = await this.db.getById<Libro>('libros', prestamo.libroId);
      if (libro) {
        await this.db.update<Libro>('libros', { ...libro, disponible: true });
      }
    }
    return this.db.delete('prestamos', id);
  }
}