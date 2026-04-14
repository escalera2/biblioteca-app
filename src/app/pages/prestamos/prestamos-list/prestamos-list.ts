import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IndexeddbService, Prestamo } from '../../../services/indexeddb';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './prestamos-list.html',
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {

  prestamos: Prestamo[] = [];
  prestamosFiltrados: Prestamo[] = [];
  busqueda = '';

  constructor(
    private db: IndexeddbService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarPrestamos();
  }

  async cargarPrestamos() {
    this.prestamos = await this.db.getAll<Prestamo>('prestamos');
    this.prestamosFiltrados = [...this.prestamos];
    this.cdr.detectChanges();
  }

  filtrar() {
    const q = this.busqueda.toLowerCase();
    this.prestamosFiltrados = this.prestamos.filter(p =>
      p.nombrePersona.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q)
    );
  }
}