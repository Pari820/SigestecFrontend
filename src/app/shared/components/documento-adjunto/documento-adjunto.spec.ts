import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { DocumentoAdjunto } from './documento-adjunto';

describe('DocumentoAdjunto', () => {
  const api = { blob: vi.fn(), abrirArchivo: vi.fn(), mensaje: vi.fn(() => 'Error genérico') };

  function crear() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [DocumentoAdjunto],
      providers: [{ provide: ApiService, useValue: api }],
    });
    return TestBed.createComponent(DocumentoAdjunto);
  }

  it('determina disponibilidad y título según archivo, nombre o URL', () => {
    const fixture = crear();
    const component = fixture.componentInstance;
    expect(component.disponible).toBe(false);
    expect(component.titulo).toBe('Documento adjunto');
    component.nombre = 'Contrato';
    expect(component.titulo).toBe('Contrato');
    component.url = '/archivos/contrato.pdf';
    expect(component.disponible).toBe(true);
    expect(component.titulo).toBe('contrato.pdf');
    component.archivo = new File(['pdf'], 'local.pdf', { type: 'application/pdf' });
    expect(component.titulo).toBe('local.pdf');
    fixture.destroy();
  });

  it('muestra una vista previa de imagen seleccionada localmente y permite cerrarla', () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:imagen');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const fixture = crear();
    const component = fixture.componentInstance;
    component.archivo = new File(['imagen'], 'foto.png', { type: 'image/png' });
    component.ver();
    expect(component.vista).not.toBeNull();
    expect(component.vistaEsImagen).toBe(true);
    expect(component.imagenUrl).toBe('blob:imagen');
    component.ver();
    expect(component.vista).toBeNull();
    expect(revoke).toHaveBeenCalledWith('blob:imagen');
    fixture.destroy();
    create.mockRestore();
    revoke.mockRestore();
  });

  it('rechaza referencias de archivo que no cumplen el formato permitido', () => {
    const fixture = crear();
    const component = fixture.componentInstance;
    component.url = '/archivos/../../privado.exe';
    component.ver();
    expect(component.error).toBe('No se reconoce la referencia del documento.');
    expect(api.blob).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('consulta el archivo remoto y genera una vista previa PDF', () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:pdf');
    api.blob.mockReturnValueOnce(of(new Blob(['pdf'], { type: 'application/pdf' })));
    const fixture = crear();
    const component = fixture.componentInstance;
    component.url = '/archivos/informe.pdf';
    component.ver();
    expect(api.blob).toHaveBeenCalledWith('/archivos/informe.pdf');
    expect(component.cargando).toBe(false);
    expect(component.vista).not.toBeNull();
    expect(component.vistaEsImagen).toBe(false);
    fixture.destroy();
    create.mockRestore();
  });

  it('traduce errores de acceso al documento', () => {
    api.blob.mockReturnValueOnce(throwError(() => ({ status: 403 })));
    const fixture = crear();
    const component = fixture.componentInstance;
    component.url = '/archivos/privado.pdf';
    component.ver();
    expect(component.error).toContain('Acceso denegado');
    expect(component.cargando).toBe(false);
    fixture.destroy();
  });

  it('abre un archivo local y libera la URL temporal', () => {
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:temporal');
    const revoke = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined);
    const abrir = vi.spyOn(window, 'open').mockReturnValue(null);
    const fixture = crear();
    const component = fixture.componentInstance;
    component.archivo = new File(['pdf'], 'local.pdf', { type: 'application/pdf' });
    component.abrir();
    expect(abrir).toHaveBeenCalledWith('blob:temporal', '_blank', 'noopener,noreferrer');
    fixture.destroy();
    create.mockRestore();
    revoke.mockRestore();
    abrir.mockRestore();
  });
});
