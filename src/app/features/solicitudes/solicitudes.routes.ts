import { Routes } from '@angular/router';
import { ROLES_COMERCIAL } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const solicitudesRoutes: Routes = [
  pantallaLazy('solicitudes', () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes), ROLES_COMERCIAL, 'listado', 'Solicitudes de servicio'),
  pantallaLazy(
    'solicitudes/nueva',
    () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes),
    ROLES_COMERCIAL,
    'nuevo',
    'Nueva solicitud de servicio',
  ),
  pantallaLazy('solicitudes/editar/:id', () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes), ROLES_COMERCIAL, 'editar', 'Editar solicitud'),
  pantallaLazy('solicitudes/ver/:id', () => import('./pages/solicitudes/solicitudes').then(m => m.Solicitudes), ROLES_COMERCIAL, 'detalle', 'Detalle de solicitud'),
];
