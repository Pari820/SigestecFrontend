import { Routes } from '@angular/router';
import { ROLES_PLAN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const asignacionesRoutes: Routes = [
  pantallaLazy('asignaciones', () => import('./pages/asignaciones/asignaciones').then(m => m.Asignaciones), ROLES_PLAN, 'listado', 'Asignaciones de personal'),
  pantallaLazy('asignaciones/nueva', () => import('./pages/asignaciones/asignaciones').then(m => m.Asignaciones), ROLES_PLAN, 'nuevo', 'Nueva asignación'),
  pantallaLazy('asignaciones/editar/:id', () => import('./pages/asignaciones/asignaciones').then(m => m.Asignaciones), ROLES_PLAN, 'editar', 'Cambiar equipo'),
  pantallaLazy('asignaciones/ver/:id', () => import('./pages/asignaciones/asignaciones').then(m => m.Asignaciones), ROLES_PLAN, 'detalle', 'Detalle de asignación'),
];
