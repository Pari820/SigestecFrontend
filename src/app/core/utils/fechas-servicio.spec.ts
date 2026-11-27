import { describe, expect, it } from 'vitest';
import { desplazarDiaISO, fechaISO, fechaLocalHoy } from './fechas-servicio';

describe('fechas-servicio', () => {
  it('devuelve la fecha local en formato YYYY-MM-DD', () => {
    const fecha = fechaLocalHoy();
    expect(fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('extrae una fecha ISO válida y rechaza otros valores', () => {
    expect(fechaISO('2026-11-26T15:30:00Z')).toBe('2026-11-26');
    expect(fechaISO('2026-02-31')).toBe('2026-02-31');
    expect(fechaISO(20261126)).toBe('');
    expect(fechaISO(null)).toBe('');
    expect(fechaISO('26/11/2026')).toBe('');
  });

  it('desplaza días sin depender del huso horario', () => {
    expect(desplazarDiaISO('2026-01-31', 1)).toBe('2026-02-01');
    expect(desplazarDiaISO('2024-02-28', 1)).toBe('2024-02-29');
    expect(desplazarDiaISO('2026-03-01', -1)).toBe('2026-02-28');
    expect(desplazarDiaISO('fecha-invalida', 1)).toBe('');
  });
});
