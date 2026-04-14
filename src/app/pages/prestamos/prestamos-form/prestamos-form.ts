import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IndexeddbService, Prestamo } from '../../../services/indexeddb';

@Component({
  selector: 'app-prestamos-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prestamos-form.html',
  styleUrl: './prestamos-form.scss',
})
export class PrestamosForm {

  prestamo: Prestamo = {
    libroId: 0,
    nombrePersona: '',
    fechaPrestamo: '',
    fechaDevolucion: '',
    estado: '',
    observaciones: ''
  };

  constructor(private db: IndexeddbService) {}

  async guardar() {
    await this.db.add('prestamos', this.prestamo);
    alert('Préstamo registrado');
    this.prestamo = {
      libroId: 0,
      nombrePersona: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      estado: '',
      observaciones: ''
    };
  }
}