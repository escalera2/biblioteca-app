import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { LibrosService } from '../../../services/libros';
import { AutoresService } from '../../../services/autores';
import { Libro } from '../../../services/indexeddb';

@Component({
  selector: 'app-libros-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './libros-list.html',
  styleUrls: ['./libros-list.scss'],
})
export class LibrosListComponent implements OnInit {
  libros: Libro[] = [];
  autoresMap = new Map<number, string>();

  private librosService = inject(LibrosService);
  private autoresService = inject(AutoresService);

  async ngOnInit() {
    await this.loadAutores();
    await this.loadLibros();
  }

  private async loadAutores() {
    const autores = await this.autoresService.getAll();
    autores.forEach((a) => {
      if (a.id !== undefined) {
        this.autoresMap.set(a.id, `${a.nombre} ${a.apellido}`);
      }
    });
  }

  private async loadLibros() {
    this.libros = await this.librosService.getAll();
  }

  getNombreAutor(autorId: number): string {
    return this.autoresMap.get(autorId) || 'Autor eliminado';
  }

  async delete(id: number) {
    if (confirm('¿Estás seguro de eliminar este libro?')) {
      await this.librosService.delete(id);
      await this.loadLibros();
    }
  }
}
