import { Routes } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';

export const auditoriaRoutes: Routes = [
  { path: 'auditoria', loadComponent: () => import('./pages/auditoria/auditoria').then(m => m.Auditoria), canActivate: [rolesGuard],
    data: { roles: ['ADMIN'] }, title: 'Auditoría del sistema | SIGESTEC' },
];
