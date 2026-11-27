import { Route } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';


export function pantalla(
  path: string,
  component: any,
  roles: string[],
  vista: string,
  titulo: string,
): Route {
  return {
    path,
    component,
    canActivate: [rolesGuard],
    data: { roles, vista },
    title: titulo,
  };
}

export function pantallaLazy(
  path: string,
  loadComponent: () => Promise<any>,
  roles: string[],
  vista: string,
  titulo: string,
): Route {
  return {
    path,
    loadComponent,
    canActivate: [rolesGuard],
    data: { roles, vista },
    title: titulo,
  };
}