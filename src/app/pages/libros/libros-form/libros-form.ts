import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibrosService } from '../../../services/libros';
import { AutoresService } from '../../../services/autores';
import { Libro, Autor } from '../../../services/indexeddb';

@Component({
  selector: 'app-libros-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libros-form.html',
  styleUrls: ['./libros-form.scss'],
})
export class LibrosFormComponent implements OnInit {
  form = inject(FormBuilder).group({
    titulo: ['', Validators.required],
    isbn: ['', Validators.required],
    anioPublicacion: [new Date().getFullYear(), [Validators.required, Validators.min(1000)]],
    genero: ['', Validators.required],
    descripcion: [''],
    autorId: [0, Validators.required],
    disponible: [true],
  });

  autores: Autor[] = [];
  isEditing = false;
  libroId: number | null = null;

  private librosService = inject(LibrosService);
  private autoresService = inject(AutoresService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  async ngOnInit() {
    try {
      this.autores = await this.autoresService.getAll();
      this.cdr.detectChanges();
    } catch (error) {
      console.error(' Error al cargar autores:', error);
    }

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditing = true;
      this.libroId = +idParam;
      try {
        const libro = await this.librosService.getById(this.libroId);
        if (libro) {
          this.form.patchValue(libro);
          this.cdr.detectChanges();
        }
      } catch (error) {
        console.error(' Error al cargar libro:', error);
      }
    }
  }

  trackByAutorId(_index: number, autor: Autor): number {
    return autor.id!;
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const value = this.form.value as Libro;
      if (this.isEditing && this.libroId) {
        value.id = this.libroId;
        await this.librosService.update(value);
      } else {
        await this.librosService.create(value);
      }
      this.router.navigate(['/libros']);
    } catch (error) {
      console.error(' Error al guardar libro:', error);
    }
  }
}
