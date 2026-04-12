import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { AutoresListComponent } from './pages/autores/autores-list/autores-list';
import { AutoresFormComponent } from './pages/autores/autores-form/autores-form';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'autores', component: AutoresListComponent },
  { path: 'autores/nuevo', component: AutoresFormComponent },
  { path: 'autores/editar/:id', component: AutoresFormComponent },
  { path: '**', redirectTo: '/dashboard' }
];