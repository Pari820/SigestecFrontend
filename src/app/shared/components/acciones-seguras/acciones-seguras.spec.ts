import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AccionesSeguras } from './acciones-seguras';
import { ApiService } from '../../../core/services/api.service';

describe('AccionesSeguras', () => {
  const api = { put: vi.fn(), mensaje: vi.fn((e: any) => e?.message || 'Error') };
  const router = { navigateByUrl: vi.fn() };

  function crear() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AccionesSeguras],
      providers: [
        { provide: ApiService, useValue: api },
        { provide: Router, useValue: router },
      ],
    });
    const fixture = TestBed.createComponent(AccionesSeguras);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('expone los campos configurados para los módulos principales', () => {
    const { component } = crear();
    const casos: Record<string, string[]> = {
      solicitudes: ['descripcion', 'observaciones', 'lugarServicio'],
      cotizaciones: ['numero', 'estado'],
      compras: ['numero', 'estado'],
      ats: ['condicionesArea', 'observaciones'],
      ejecuciones: ['descripcion', 'mediciones', 'observaciones'],
      informes: ['diagnostico', 'trabajosRealizados', 'conclusiones', 'recomendaciones'],
      clientes: ['razonSocial', 'telefono', 'correo'],
      materiales: ['nombre', 'unidadMedida', 'stockMinimo'],
      herramientas: ['nombre', 'descripcion'],
      'movimientos-materiales': ['tipoMovimiento', 'cantidad'],
      'movimientos-herramientas': ['tipoMovimiento', 'cantidad'],
    };
    for (const [recurso, claves] of Object.entries(casos)) {
      component.recurso = recurso;
      expect(component.campos.map((campo) => campo.key)).toEqual(claves);
    }
    component.recurso = 'no-existe';
    expect(component.campos).toEqual([]);
  });

  it('obtiene identificadores y estado activo del registro', () => {
    const { component } = crear();
    component.recurso = 'clientes';
    component.registro = { id: 4, numeroRegistro: 28, estado: 'A' };
    expect(component.identificadorRegistro).toBe('#28');
    expect(component.activo).toBe(true);
    component.registro = { id: 4, estado: 'I' };
    expect(component.activo).toBe(false);
    component.recurso = 'compras';
    component.registro = { id: 7, codigo: 'OC-007' };
    expect(component.identificadorRegistro).toBe('OC-007');
  });

  it('dirige la edición a la pantalla nativa o genérica según el módulo', () => {
    const { component } = crear();
    component.recurso = 'solicitudes';
    component.registro = { id: 12 };
    component.editar();
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/solicitudes/editar/12');
    component.recurso = 'clientes';
    component.editar();
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/gestion/editar/clientes/12');
  });

  it('convierte el stock mínimo a número y notifica al guardar', () => {
    const { fixture, component } = crear();
    const cerrar = vi.fn();
    component.modal = { nativeElement: { close: cerrar } } as any;
    component.recurso = 'materiales';
    component.registro = { id: 9 };
    component.datos = { nombre: 'Cable', stockMinimo: '5' };
    api.put.mockReturnValueOnce(of({ mensaje: 'Guardado' }));
    const emit = vi.spyOn(component.actualizado, 'emit');
    component.guardar();
    expect(api.put).toHaveBeenLastCalledWith('/gestion/materiales/9', { nombre: 'Cable', stockMinimo: 5 });
    expect(component.guardando()).toBe(false);
    expect(component.exito()).toBe('Guardado');
    expect(cerrar).toHaveBeenCalledOnce();
    expect(emit).toHaveBeenCalledOnce();
    fixture.destroy();
  });

  it('muestra el error del servicio si el guardado falla', () => {
    const { component } = crear();
    component.modal = { nativeElement: { close: vi.fn() } } as any;
    component.recurso = 'clientes';
    component.registro = { id: 2 };
    api.put.mockReturnValueOnce(throwError(() => new Error('Conflicto')));
    component.guardar();
    expect(component.guardando()).toBe(false);
    expect(component.error()).toBe('Conflicto');
  });
});
