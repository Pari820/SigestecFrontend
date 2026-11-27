import { Routes } from '@angular/router';
import { ROLES_PLAN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const ejecucionesRoutes: Routes = [
  pantallaLazy('ejecuciones', () => import('./pages/ejecuciones/ejecuciones').then(m => m.Ejecuciones), ROLES_PLAN, 'listado', 'Ejecuciones de servicio'),
  pantallaLazy('ejecuciones/nueva', () => import('./pages/ejecuciones/ejecuciones').then(m => m.Ejecuciones), ROLES_PLAN, 'nuevo', 'Nueva ejecución'),
  pantallaLazy('ejecuciones/editar/:id', () => import('./pages/ejecuciones/ejecuciones').then(m => m.Ejecuciones), ROLES_PLAN, 'editar', 'Editar ejecución'),
  pantallaLazy('ejecuciones/ver/:id', () => import('./pages/ejecuciones/ejecuciones').then(m => m.Ejecuciones), ROLES_PLAN, 'detalle', 'Detalle ejecución'),
];
