import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PrestamosService } from '../../../services/prestamos';
import { LibrosService } from '../../../services/libros';
import { Prestamo, Libro } from '../../../services/indexeddb';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './prestamos-list.html',
})
export class PrestamosListComponent implements OnInit {
  prestamos: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  librosMap: { [id: number]: Libro } = {};
  busqueda = '';
  prestamoAEliminar: Prestamo | null = null;
  mensaje = '';
  tipoMensaje = '';

  constructor(
    private prestamosService: PrestamosService,
    private librosService: LibrosService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.cargarDatos();
  }

  async cargarDatos() {
    const libros = await this.librosService.getAll();
    libros.forEach((l) => {
      if (l.id) this.librosMap[l.id] = l;
    });
    this.prestamos = await this.prestamosService.getAll();
    this.prestamosFiltrados = [...this.prestamos];
    this.cdr.detectChanges();
  }

  filtrar() {
    const q = this.busqueda.toLowerCase();
    this.prestamosFiltrados = this.prestamos.filter(
      (p) =>
        p.nombrePersona.toLowerCase().includes(q) ||
        p.estado.toLowerCase().includes(q) ||
        this.getNombreLibro(p.libroId).toLowerCase().includes(q),
    );
  }

  getNombreLibro(libroId: number): string {
    const l = this.librosMap[libroId];
    return l ? l.titulo : 'Libro no encontrado';
  }

  async devolver(prestamo: Prestamo) {
    await this.prestamosService.devolver(prestamo);
    this.mostrarMensaje('Libro devuelto correctamente.', 'success');
    await this.cargarDatos();
  }

  confirmarEliminar(prestamo: Prestamo) {
    this.prestamoAEliminar = prestamo;
  }

  async eliminar() {
    if (!this.prestamoAEliminar?.id) return;
    await this.prestamosService.delete(this.prestamoAEliminar.id);
    this.mostrarMensaje('Préstamo eliminado correctamente.', 'success');
    this.prestamoAEliminar = null;
    await this.cargarDatos();
  }

  mostrarMensaje(msg: string, tipo: string) {
    this.mensaje = msg;
    this.tipoMensaje = tipo;
    setTimeout(() => (this.mensaje = ''), 4000);
  }
}
