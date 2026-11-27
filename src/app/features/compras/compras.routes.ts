import { Routes } from '@angular/router';
import { ROLES_COMERCIAL } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const comprasRoutes: Routes = [
  pantallaLazy('compras', () => import('./pages/compras/compras').then(m => m.Compras), ROLES_COMERCIAL, 'listado', 'Órdenes de compra'),
  pantallaLazy('compras/nueva', () => import('./pages/compras/compras').then(m => m.Compras), ROLES_COMERCIAL, 'nuevo', 'Nueva orden de compra'),
  pantallaLazy('compras/editar/:id', () => import('./pages/compras/compras').then(m => m.Compras), ROLES_COMERCIAL, 'editar', 'Editar orden de compra'),
  pantallaLazy('compras/ver/:id', () => import('./pages/compras/compras').then(m => m.Compras), ROLES_COMERCIAL, 'detalle', 'Detalle de orden de compra'),
];
