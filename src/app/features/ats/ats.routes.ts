import { Routes } from '@angular/router';
import { ROLES_PLAN, ROLES_ATS } from '../../core/config/roles';
import { pantallaLazy } from '../../shared/utils/pantalla-route';
export const atsRoutes: Routes = [
  pantallaLazy('ats/aprobaciones/ver/:id', () => import('../../shared/pages/detalle-operativo/detalle-operativo').then(m => m.DetalleOperativo), ROLES_PLAN, 'detalle', 'Detalle aprobación ATS'),

  pantallaLazy('ats', () => import('./pages/ats/ats').then(m => m.AtsPage), ROLES_ATS, 'listado', 'Análisis de Trabajo Seguro'),
  pantallaLazy('ats/nuevo', () => import('./pages/ats/ats').then(m => m.AtsPage), ROLES_ATS, 'nuevo', 'Registrar ATS'),
  pantallaLazy('ats/editar/:id', () => import('./pages/ats/ats').then(m => m.AtsPage), ROLES_ATS, 'editar', 'Editar ATS'),
  pantallaLazy('ats/ver/:id', () => import('./pages/ats/ats').then(m => m.AtsPage), ['SSOMA', 'SUPERVISOR'], 'detalle', 'Detalle del ATS'),
  pantallaLazy('ats/aprobaciones', () => import('./pages/aprobaciones-ats/aprobaciones-ats').then(m => m.AprobacionesAts), ROLES_PLAN, 'listado', 'Aprobaciones ATS'),
  pantallaLazy('ats/aprobaciones/nueva', () => import('./pages/aprobaciones-ats/aprobaciones-ats').then(m => m.AprobacionesAts), ROLES_PLAN, 'nuevo', 'Aprobar ATS'),
  pantallaLazy('ats/aprobaciones/nueva/:id', () => import('./pages/aprobaciones-ats/aprobaciones-ats').then(m => m.AprobacionesAts), ROLES_PLAN, 'nuevo', 'Aprobar ATS'),
];
