import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AutoresService } from '../../../services/autores';
import { LibrosService } from '../../../services/libros';
import { Autor } from '../../../services/indexeddb';

@Component({
  selector: 'app-autores-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './autores-list.html'
})
export class AutoresListComponent implements OnInit {
  autores: Autor[] = [];
  autoresFiltrados: Autor[] = [];
  librosCount: { [id: number]: number } = {};
  busqueda = '';
  autorAEliminar: Autor | null = null;
  mensaje = '';
  tipoMensaje = '';

  constructor(
    private autoresService: AutoresService,
    private librosService: LibrosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarAutores();
  }

  async cargarAutores() {
    this.autores = await this.autoresService.getAll();
    this.autoresFiltrados = [...this.autores];
    for (const autor of this.autores) {
      if (autor.id) {
        const libros = await this.librosService.getByAutor(autor.id);
        this.librosCount[autor.id] = libros.length;
      }
    }
    this.cdr.detectChanges();
  }

  filtrar() {
    const q = this.busqueda.toLowerCase();
    this.autoresFiltrados = this.autores.filter(a =>
      a.nombre.toLowerCase().includes(q) ||
      a.apellido.toLowerCase().includes(q) ||
      a.nacionalidad.toLowerCase().includes(q)
    );
  }

  confirmarEliminar(autor: Autor) {
    this.autorAEliminar = autor;
  }

  async eliminar() {
    if (!this.autorAEliminar?.id) return;
    const libros = await this.librosService.getByAutor(this.autorAEliminar.id);
    if (libros.length > 0) {
      this.mostrarMensaje(
        `No se puede eliminar: el autor tiene ${libros.length} libro(s).`, 'danger'
      );
      this.autorAEliminar = null;
      return;
    }
    await this.autoresService.delete(this.autorAEliminar.id);
    this.mostrarMensaje('Autor eliminado correctamente.', 'success');
    this.autorAEliminar = null;
    await this.cargarAutores();
  }

  mostrarMensaje(msg: string, tipo: string) {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => this.mensaje = '', 4000);
  }
}