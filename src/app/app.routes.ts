import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AutoresListComponent } from './pages/autores/autores-list/autores-list';
import { AutoresFormComponent } from './pages/autores/autores-form/autores-form';
import { LibrosListComponent } from './pages/libros/libros-list/libros-list';
import { LibrosFormComponent } from './pages/libros/libros-form/libros-form';
import { PrestamosListComponent } from './pages/prestamos/prestamos-list/prestamos-list';
import { PrestamosForm } from './pages/prestamos/prestamos-form/prestamos-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'autores', component: AutoresListComponent },
  { path: 'autores/nuevo', component: AutoresFormComponent },
  { path: 'autores/editar/:id', component: AutoresFormComponent },

  { path: 'libros', component: LibrosListComponent },
  { path: 'libros/nuevo', component: LibrosFormComponent },
  { path: 'libros/editar/:id', component: LibrosFormComponent },

  { path: 'prestamos', component: PrestamosListComponent },
  { path: 'prestamos/nuevo', component: PrestamosForm },

  { path: '**', redirectTo: '/dashboard' }
];