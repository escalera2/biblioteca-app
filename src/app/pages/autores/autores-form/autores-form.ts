import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AutoresService } from '../../../services/autores';

@Component({
  selector: 'app-autores-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './autores-form.html'
})
export class AutoresFormComponent implements OnInit {
  form!: FormGroup;
  esEdicion = false;
  autorId: number | null = null;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private autoresService: AutoresService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre:          ['', [Validators.required, Validators.minLength(2)]],
      apellido:        ['', [Validators.required, Validators.minLength(2)]],
      nacionalidad:    ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      biografia:       ['', [Validators.required, Validators.minLength(10)]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.autorId = +id;
      this.cargarAutor(this.autorId);
    }
  }

  async cargarAutor(id: number) {
    const autor = await this.autoresService.getById(id);
    if (autor) this.form.patchValue(autor);
  }

  async guardar() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.cargando = true;
    try {
      if (this.esEdicion && this.autorId) {
        await this.autoresService.update({ id: this.autorId, ...this.form.value });
      } else {
        await this.autoresService.create(this.form.value);
      }
      this.router.navigate(['/autores']);
    } catch {
      this.cargando = false;
    }
  }

  get f() { return this.form.controls; }
}