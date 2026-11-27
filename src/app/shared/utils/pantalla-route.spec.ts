import { describe, expect, it, vi } from 'vitest';
import { pantalla } from './pantalla-route';

describe('pantalla', () => {
  it('crea una ruta protegida con metadatos y título', () => {
    const componente = class ComponentePrueba {};
    const ruta = pantalla('listado', componente, ['GERENTE'], 'listado', 'Listado de prueba');

    expect(ruta.path).toBe('listado');
    expect(ruta.component).toBe(componente);
    expect(ruta.canActivate).toHaveLength(1);
    expect(ruta.data).toEqual({ roles: ['GERENTE'], vista: 'listado' });
    expect(ruta.title).toBe('Listado de prueba');
  });
});
