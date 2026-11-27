import { Routes } from '@angular/router';
import { ROLES_PLAN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const conformidadesRoutes: Routes = [
  pantallaLazy('conformidades', () => import('./pages/conformidades/conformidades').then(m => m.Conformidades), ROLES_PLAN, 'listado', 'Conformidad del servicio'),
  pantallaLazy('conformidades/nueva', () => import('./pages/conformidades/conformidades').then(m => m.Conformidades), ROLES_PLAN, 'nuevo', 'Registrar conformidad'),
  pantallaLazy('conformidades/ver/:id', () => import('./pages/conformidades/conformidades').then(m => m.Conformidades), ROLES_PLAN, 'detalle', 'Detalle conformidad'),
];
