import { Routes } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';
import { ROLES_PLAN } from '../../core/config/roles';
export const personalRoutes: Routes = [
  {
    path: 'personal',
    loadComponent: () => import('./pages/personal/personal').then(m => m.PersonalCatalogo),
    data: { roles: ROLES_PLAN },
    canActivate: [rolesGuard],
  },
];
