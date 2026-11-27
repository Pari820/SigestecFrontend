import { Routes } from '@angular/router';
import { ROLES_COMERCIAL } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const cotizacionesRoutes: Routes = [
  pantallaLazy('cotizaciones', () => import('./pages/cotizaciones/cotizaciones').then(m => m.Cotizaciones), ROLES_COMERCIAL, 'listado', 'Cotizaciones'),
  pantallaLazy('cotizaciones/nueva', () => import('./pages/cotizaciones/cotizaciones').then(m => m.Cotizaciones), ROLES_COMERCIAL, 'nuevo', 'Nueva cotización'),
  pantallaLazy('cotizaciones/editar/:id', () => import('./pages/cotizaciones/cotizaciones').then(m => m.Cotizaciones), ROLES_COMERCIAL, 'editar', 'Editar cotización'),
  pantallaLazy(
    'cotizaciones/ver/:id',
    () => import('./pages/cotizaciones/cotizaciones').then(m => m.Cotizaciones),
    ROLES_COMERCIAL,
    'detalle',
    'Detalle de cotización',
  ),
];
