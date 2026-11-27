import { Routes } from '@angular/router';
export const inicioRoutes: Routes = [
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio), title: 'Inicio | SIGESTEC' },
];
