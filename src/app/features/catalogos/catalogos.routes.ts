import { Routes } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';
import { ROLES_COMERCIAL } from '../../core/config/roles';
export const catalogosRoutes: Routes = [
  {
    path: 'clientes',
    loadComponent: () => import('./pages/catalogos/catalogos').then(m => m.Catalogos),
    data: { tipo: 'clientes', roles: ROLES_COMERCIAL },
    canActivate: [rolesGuard],
  },
  {
    path: 'tipos-servicio',
    loadComponent: () => import('./pages/catalogos/catalogos').then(m => m.Catalogos),
    data: { tipo: 'tipos-servicio', roles: ROLES_COMERCIAL },
    canActivate: [rolesGuard],
  },
];
