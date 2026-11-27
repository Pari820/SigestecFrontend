import { Routes } from '@angular/router';
import { ROLES_PLAN } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const informesRoutes: Routes = [
  pantallaLazy('informes', () => import('./pages/informes/informes').then(m => m.Informes), ROLES_PLAN, 'listado', 'Informes técnicos'),
  pantallaLazy('informes/nuevo', () => import('./pages/informes/informes').then(m => m.Informes), ROLES_PLAN, 'nuevo', 'Nuevo informe técnico'),
  pantallaLazy('informes/editar/:id', () => import('./pages/informes/informes').then(m => m.Informes), ROLES_PLAN, 'editar', 'Editar informe técnico'),
  pantallaLazy('informes/ver/:id', () => import('./pages/informes/informes').then(m => m.Informes), ROLES_PLAN, 'detalle', 'Detalle informe técnico'),
];
