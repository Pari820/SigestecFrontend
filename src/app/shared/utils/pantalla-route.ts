import { Route } from '@angular/router';
import { rolesGuard } from '../../core/guards/roles-guard';

/** Mantiene el patrón original: misma pantalla para listado, formulario y detalle. */
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
