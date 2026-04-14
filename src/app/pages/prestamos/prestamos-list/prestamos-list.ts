import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// ⚠️ estos servicios tal vez cambian luego
// por ahora los dejamos así (luego vemos si existen)
import { PrestamosService } from '../../../services/prestamos';

@Component({
  selector: 'app-prestamos-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './prestamos-list.html',
  styleUrl: './prestamos-list.scss',
})
export class PrestamosListComponent implements OnInit {

  prestamos: any[] = [];
  prestamosFiltrados: any[] = [];
  busqueda = '';

  constructor(
    private prestamosService: PrestamosService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarPrestamos();
  }

  async cargarPrestamos() {
    this.prestamos = await this.prestamosService.getAll();
    this.prestamosFiltrados = [...this.prestamos];
    this.cdr.detectChanges();
  }

  filtrar() {
    const q = this.busqueda.toLowerCase();
    this.prestamosFiltrados = this.prestamos.filter(p =>
      JSON.stringify(p).toLowerCase().includes(q)
    );
  }
}