import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AutoresService } from '../../services/autores';
import { LibrosService } from '../../services/libros';
import { Autor, Libro } from '../../services/indexeddb';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class DashboardComponent implements OnInit {
  totalAutores = 0;
  ultimosAutores: Autor[] = [];

  totalLibros = 0;
  librosDisponibles = 0;
  ultimosLibros: Libro[] = [];

  constructor(
    private autoresService: AutoresService,
    private librosService: LibrosService,
    private cdr: ChangeDetectorRef,
  ) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const [autores, libros] = await Promise.all([
      this.autoresService.getAll(),
      this.librosService.getAll(),
    ]);

    this.totalAutores = autores.length;
    this.ultimosAutores = autores.slice(-5).reverse();

    this.totalLibros = libros.length;
    this.librosDisponibles = libros.filter((l) => l.disponible).length;
    this.ultimosLibros = libros.slice(-5).reverse();

    this.cdr.detectChanges();
  }
}
