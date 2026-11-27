import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { PaginaBase, REGISTROS_POR_PAGINA } from './pagina-base';

class PaginaPrueba extends PaginaBase {
  texto(x: any) { return this.textoBusqueda(x); }
  estado(x: any) { return this.estadoDe(x); }
  ejecutarGuardar(llamada: any, ruta: string) {
    this.protegidoCargando(llamada, 'Guardando', ruta);
  }
  guardarArchivo(modulo: string, id: number, datos: Record<string, unknown>, pdf: File | null, quitar: boolean, ruta: string) {
    this.guardarCorreccionConArchivo(modulo, id, datos, pdf, quitar, ruta);
  }
  cargar(url: string) { this.cargarItems(url); }
}

describe('PaginaBase', () => {
  const apiMock = {
    get: vi.fn(),
    put: vi.fn(),
    mensaje: vi.fn((e: any) => e?.message || 'Error controlado'),
  };
  const routerMock = { navigateByUrl: vi.fn() };

  function crearPagina(vista = 'listado', id = '2') {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useValue: apiMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { vista }, paramMap: { get: () => id } } },
        },
      ],
    });
    return TestBed.runInInjectionContext(() => new PaginaPrueba());
  }

  it('expone vista, id y estado de pantalla', () => {
    const pagina = crearPagina('detalle', '8');
    expect(pagina.vista).toBe('detalle');
    expect(pagina.id).toBe(8);
    expect(pagina.enListado).toBe(false);
    expect(pagina.esDetalle).toBe(true);
    expect(pagina.esEdicion).toBe(false);
    expect(pagina.tamanoPagina).toBe(REGISTROS_POR_PAGINA);
  });

  it('filtra por texto y estado, y calcula páginas y estados disponibles', () => {
    const pagina = crearPagina();
    pagina.items.set([
      { id: 1, nombre: 'Servicio Lima', estado: 'PENDIENTE' },
      { id: 2, nombre: 'Servicio Cusco', estado: 'APROBADO' },
      { id: 3, nombre: 'Compra Lima', estado: 'PENDIENTE' },
    ]);
    expect(pagina.registro?.id).toBe(2);
    expect(pagina.filtrados).toHaveLength(3);
    expect(pagina.estados).toEqual(['APROBADO', 'PENDIENTE']);
    pagina.buscar = 'lima';
    expect(pagina.filtrados).toHaveLength(2);
    pagina.filtro = 'PENDIENTE';
    expect(pagina.filtrados).toHaveLength(2);
    expect(pagina.numeroPaginas).toBe(1);
    expect(pagina.paginas).toEqual([1]);
    expect(pagina.paginados).toHaveLength(2);
  });

  it('limita la paginación y reinicia la página al buscar', () => {
    const pagina = crearPagina();
    pagina.items.set(Array.from({ length: 25 }, (_, i) => ({ id: i + 1, estado: 'PENDIENTE' })));
    pagina.irPagina(99);
    expect(pagina.pagina).toBe(3);
    pagina.irPagina(-1);
    expect(pagina.pagina).toBe(1);
    pagina.irPagina(2);
    pagina.buscarAhora();
    expect(pagina.pagina).toBe(1);
  });

  it('clasifica estados conocidos y desconocidos', () => {
    const pagina = crearPagina();
    expect(pagina.claseEstado('PENDIENTE')).toBe('estado-pendiente');
    expect(pagina.claseEstado('APROBADO')).toBe('estado-exito');
    expect(pagina.claseEstado('RECHAZADA')).toBe('estado-error');
    expect(pagina.claseEstado('PROGRAMADA')).toBe('estado-info');
    expect(pagina.claseEstado('OTRO')).toBe('estado-neutral');
  });

  it('navega cuando una operación termina correctamente y expone el error si falla', () => {
    const pagina = crearPagina();
    pagina.ejecutarGuardar(of({}), '/solicitudes');
    expect(pagina.guardando()).toBe(false);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/solicitudes');

    pagina.ejecutarGuardar(throwError(() => new Error('No guardado')), '/solicitudes');
    expect(pagina.error()).toBe('No guardado');
    expect(pagina.guardando()).toBe(false);
  });

  it('carga registros y conserva el error del servicio', () => {
    const pagina = crearPagina();
    apiMock.get.mockReturnValueOnce(of([{ id: 1 }]));
    pagina.cargar('/clientes');
    expect(pagina.items()).toEqual([{ id: 1 }]);
    apiMock.get.mockReturnValueOnce(throwError(() => new Error('Sin conexión')));
    pagina.actualizarListado('/clientes');
    expect(pagina.error()).toBe('Sin conexión');
  });

  it('guarda correcciones simples y correcciones con archivo', () => {
    const pagina = crearPagina();
    apiMock.put.mockReturnValue(of({}));
    pagina.guardarArchivo('solicitudes', 4, { descripcion: 'Actualizada' }, null, false, '/solicitudes');
    expect(apiMock.put).toHaveBeenLastCalledWith('/gestion/solicitudes/4', { descripcion: 'Actualizada' });

    const pdf = new File(['contenido'], 'evidencia.pdf', { type: 'application/pdf' });
    pagina.guardarArchivo('solicitudes', 4, { descripcion: 'Con PDF' }, pdf, false, '/solicitudes');
    const [ruta, cuerpo] = apiMock.put.mock.lastCall || [];
    expect(ruta).toBe('/gestion/solicitudes/4/documento');
    expect(cuerpo).toBeInstanceOf(FormData);
    expect((cuerpo as FormData).get('pdf')).toBe(pdf);
    expect((cuerpo as FormData).get('quitar')).toBe('false');
  });
});
