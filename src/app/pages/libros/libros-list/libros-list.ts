import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LibrosService } from '../../../services/libros';
import { AutoresService } from '../../../services/autores';
import { Libro } from '../../../services/indexeddb';

@Component({
  selector: 'app-libros-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './libros-list.html',
  styleUrls: ['./libros-list.scss'],
})
export class LibrosListComponent implements OnInit {
  libros: Libro[] = [];
  librosFiltrados: Libro[] = [];
  autoresMap = new Map<number, string>();

  libroAEliminar: Libro | null = null;
  mostrarModal = false;
  busqueda: string = '';

  private librosService = inject(LibrosService);
  private autoresService = inject(AutoresService);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    await this.loadAutores();
    await this.loadLibros();
  }

  private async loadAutores() {
    try {
      const autores = await this.autoresService.getAll();
      autores.forEach((a) => {
        if (a.id !== undefined) {
          this.autoresMap.set(a.id, `${a.nombre} ${a.apellido}`);
        }
      });
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando autores:', error);
    }
  }

  private async loadLibros() {
    try {
      this.libros = await this.librosService.getAll();
      this.filtrar();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error cargando libros:', error);
    }
  }

  filtrar() {
    const term = this.busqueda.toLowerCase();
    this.librosFiltrados = this.libros.filter(
      (libro) =>
        libro.titulo.toLowerCase().includes(term) ||
        libro.isbn.toLowerCase().includes(term) ||
        libro.genero.toLowerCase().includes(term),
    );
  }

  getNombreAutor(autorId: number): string {
    return this.autoresMap.get(autorId) || 'Autor desconocido';
  }

  confirmarEliminar(libro: Libro) {
    this.libroAEliminar = libro;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.libroAEliminar = null;
  }

  async eliminar() {
    if (this.libroAEliminar) {
      try {
        await this.librosService.delete(this.libroAEliminar.id!);
        this.cerrarModal();
        await this.loadLibros();
      } catch (error) {
        console.error('Error eliminando:', error);
      }
    }
  }
}
