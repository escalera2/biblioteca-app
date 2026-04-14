import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { PrestamosService } from '../../../services/prestamos';
import { LibrosService } from '../../../services/libros';
import { Libro } from '../../../services/indexeddb';

@Component({
  selector: 'app-prestamos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './prestamos-form.html'
})
export class PrestamosFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  prestamoId: number | null = null;
  libros: Libro[] = [];
  librosDisponibles: Libro[] = [];
  cargando = false;
  sinLibros = false;

  constructor(
    private fb: FormBuilder,
    private prestamosService: PrestamosService,
    private librosService: LibrosService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.libros = await this.librosService.getAll();
    this.librosDisponibles = this.libros.filter(l => l.disponible);

    this.form = this.fb.group({
      libroId:        ['', Validators.required],
      nombrePersona:  ['', [Validators.required, Validators.minLength(3)]],
      fechaPrestamo:  ['', Validators.required],
      fechaDevolucion:['', Validators.required],
      estado:         ['activo'],
      observaciones:  ['']
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.prestamoId = +id;
      const prestamo = await this.prestamosService.getById(this.prestamoId);
      if (prestamo) {
        this.form.patchValue(prestamo);
        // En edición mostrar todos los libros
        this.librosDisponibles = this.libros;
      }
    }

    this.sinLibros = this.librosDisponibles.length === 0 && !this.esEdicion;
    this.cdr.detectChanges();
  }

  async guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;
    const datos = {
      ...this.form.value,
      libroId: +this.form.value.libroId
    };
    try {
      if (this.esEdicion && this.prestamoId) {
        await this.prestamosService.update({ id: this.prestamoId, ...datos });
      } else {
        await this.prestamosService.create(datos);
      }
      this.router.navigate(['/prestamos']);
    } catch(e) {
      console.error('Error al guardar:', e);
      this.cargando = false;
    }
  }

  get f() { return this.form.controls; }
}