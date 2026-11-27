import { Routes } from '@angular/router';
import { ROLES_PLAN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const programacionesRoutes: Routes = [
  pantallaLazy('programaciones', () => import('./pages/programaciones/programaciones').then(m => m.Programaciones), ROLES_PLAN, 'listado', 'Programaciones de servicio'),
  pantallaLazy('programaciones/nueva', () => import('./pages/programaciones/programaciones').then(m => m.Programaciones), ROLES_PLAN, 'nuevo', 'Programar servicio'),
  pantallaLazy(
    'programaciones/editar/:id',
    () => import('./pages/programaciones/programaciones').then(m => m.Programaciones),
    ROLES_PLAN,
    'editar',
    'Reprogramar servicio',
  ),
  pantallaLazy(
    'programaciones/ver/:id',
    () => import('./pages/programaciones/programaciones').then(m => m.Programaciones),
    ROLES_PLAN,
    'detalle',
    'Detalle de programación',
  ),
];
