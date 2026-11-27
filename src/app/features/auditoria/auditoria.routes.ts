import { Routes } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';
import { Auditoria } from './pages/auditoria/auditoria';

export const auditoriaRoutes: Routes = [
  { path: 'auditoria', component: Auditoria, canActivate: [rolesGuard],
    data: { roles: ['ADMIN'] }, title: 'Auditoría del sistema | SIGESTEC' },
];
