import { describe, expect, it } from 'vitest';
import { MODULOS_INICIO } from './menu';
import { ROLES_ALMACEN, ROLES_ATS, ROLES_COMERCIAL, ROLES_PLAN } from './roles';

describe('configuración de roles y menú', () => {
  it('asigna los roles esperados a cada grupo funcional', () => {
    expect(ROLES_COMERCIAL).toEqual(['GERENTE']);
    expect(ROLES_PLAN).toEqual(['SUPERVISOR']);
    expect(ROLES_ATS).toEqual(['SSOMA']);
    expect(ROLES_ALMACEN).toEqual(['ALMACENERO']);
  });

  it('define rutas únicas para los módulos de inicio', () => {
    const rutas = MODULOS_INICIO.map((modulo) => modulo.ruta);
    expect(MODULOS_INICIO.length).toBeGreaterThan(0);
    expect(new Set(rutas).size).toBe(rutas.length);
    expect(MODULOS_INICIO.every((modulo) => modulo.nombre && modulo.roles.length > 0)).toBe(true);
  });

  it('asigna módulos de almacén al rol ALMACENERO', () => {
    const almacen = MODULOS_INICIO.filter((modulo) => modulo.ruta.startsWith('/almacen'));
    expect(almacen.length).toBe(2);
    expect(almacen.every((modulo) => modulo.roles.includes('ALMACENERO'))).toBe(true);
  });
});
