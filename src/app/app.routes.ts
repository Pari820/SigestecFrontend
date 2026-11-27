import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { authRoutes } from './features/auth/auth.routes';
import { inicioRoutes } from './features/inicio/inicio.routes';
import { catalogosRoutes } from './features/catalogos/catalogos.routes';
import { personalRoutes } from './features/personal/personal.routes';
import { solicitudesRoutes } from './features/solicitudes/solicitudes.routes';
import { cotizacionesRoutes } from './features/cotizaciones/cotizaciones.routes';
import { comprasRoutes } from './features/compras/compras.routes';
import { asignacionesRoutes } from './features/asignaciones/asignaciones.routes';
import { programacionesRoutes } from './features/programaciones/programaciones.routes';
import { atsRoutes } from './features/ats/ats.routes';
import { ejecucionesRoutes } from './features/ejecuciones/ejecuciones.routes';
import { informesRoutes } from './features/informes/informes.routes';
import { conformidadesRoutes } from './features/conformidades/conformidades.routes';
import { almacenRoutes } from './features/almacen/almacen.routes';
import { auditoriaRoutes } from './features/auditoria/auditoria.routes';

export const routes: Routes = [
  ...authRoutes,
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/layout').then(m => m.Layout),
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      ...inicioRoutes,
      { path: 'mi-cuenta/cambiar-clave', loadComponent: () => import('./features/auth/pages/cambiar-clave/cambiar-clave').then(m => m.CambiarClave), title: 'Cambiar contraseña | SIGESTEC' },
      ...catalogosRoutes,
      ...personalRoutes,
      ...solicitudesRoutes,
      ...cotizacionesRoutes,
      ...comprasRoutes,
      ...asignacionesRoutes,
      ...programacionesRoutes,
      ...atsRoutes,
      ...ejecucionesRoutes,
      ...informesRoutes,
      ...conformidadesRoutes,
      ...almacenRoutes,
      ...auditoriaRoutes,
      { path:'gestion/editar/:recurso/:id', loadComponent: () => import('./shared/pages/editor-registro/editor-registro').then(m => m.EditorRegistro), title:'Editar registro | SIGESTEC' },
      { path: 'acceso-denegado', loadComponent: () => import('./features/inicio/pages/inicio/inicio').then(m => m.Inicio), data: { denegado: true } },
    ],
  },
  { path: '**', redirectTo: 'inicio' },
];
