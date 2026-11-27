import { Routes } from '@angular/router';
export const authRoutes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login').then(m => m.Login), title: 'Iniciar sesión | ACOIEL SAC' },
  { path: 'recuperar-clave', loadComponent: () => import('./pages/recuperar-clave/recuperar-clave').then(m => m.RecuperarClave), title: 'Recuperar contraseña | SIGESTEC' },
  { path: 'restablecer-clave', loadComponent: () => import('./pages/restablecer-clave/restablecer-clave').then(m => m.RestablecerClave), title: 'Restablecer contraseña | SIGESTEC' },
];
