import { Routes } from '@angular/router';
import { ROLES_ALMACEN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const almacenRoutes: Routes = [
  pantallaLazy('almacen/materiales/ver/:id', () => import('../../shared/pages/detalle-operativo/detalle-operativo').then(m => m.DetalleOperativo), ROLES_ALMACEN, 'detalle', 'Detalle material'),
  pantallaLazy('almacen/materiales/movimientos/ver/:id', () => import('../../shared/pages/detalle-operativo/detalle-operativo').then(m => m.DetalleOperativo), ROLES_ALMACEN, 'detalle', 'Detalle movimiento material'),
  pantallaLazy('almacen/herramientas/ver/:id', () => import('../../shared/pages/detalle-operativo/detalle-operativo').then(m => m.DetalleOperativo), ROLES_ALMACEN, 'detalle', 'Detalle herramienta'),
  pantallaLazy('almacen/herramientas/movimientos/ver/:id', () => import('../../shared/pages/detalle-operativo/detalle-operativo').then(m => m.DetalleOperativo), ROLES_ALMACEN, 'detalle', 'Detalle movimiento herramienta'),

  pantallaLazy('almacen/materiales', () => import('./pages/materiales-almacen/materiales-almacen').then(m => m.MaterialesAlmacen), ROLES_ALMACEN, 'listado', 'Almacén materiales'),
  pantallaLazy(
    'almacen/materiales/nuevo',
    () => import('./pages/materiales-almacen/materiales-almacen').then(m => m.MaterialesAlmacen),
    ROLES_ALMACEN,
    'nuevo-material',
    'Nuevo material',
  ),
  pantallaLazy(
    'almacen/materiales/movimiento',
    () => import('./pages/materiales-almacen/materiales-almacen').then(m => m.MaterialesAlmacen),
    ROLES_ALMACEN,
    'nuevo-movimiento',
    'Movimiento de material',
  ),
  pantallaLazy(
    'almacen/herramientas',
    () => import('./pages/herramientas-almacen/herramientas-almacen').then(m => m.HerramientasAlmacen),
    ROLES_ALMACEN,
    'listado',
    'Almacén herramientas',
  ),
  pantallaLazy(
    'almacen/herramientas/nueva',
    () => import('./pages/herramientas-almacen/herramientas-almacen').then(m => m.HerramientasAlmacen),
    ROLES_ALMACEN,
    'nueva-herramienta',
    'Nueva herramienta',
  ),
  pantallaLazy(
    'almacen/herramientas/movimiento',
    () => import('./pages/herramientas-almacen/herramientas-almacen').then(m => m.HerramientasAlmacen),
    ROLES_ALMACEN,
    'nuevo-movimiento',
    'Movimiento de herramienta',
  ),
];
