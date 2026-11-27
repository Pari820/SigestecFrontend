import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

describe('ApiService', () => {
  let api: ApiService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(ApiService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('realiza GET y devuelve la respuesta', () => {
    api.get('/clientes').subscribe((r) => expect(r).toEqual([{ id: 1 }]));
    const req = http.expectOne(environment.apiUrl + '/clientes');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1 }]);
  });

  it('realiza POST, PUT, PATCH y DELETE', () => {
    api.post('/clientes', { nombre: 'Ana' }).subscribe();
    const post = http.expectOne(environment.apiUrl + '/clientes');
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual({ nombre: 'Ana' });
    post.flush({});

    api.put('/clientes/1', { nombre: 'Eva' }).subscribe();
    const put = http.expectOne(environment.apiUrl + '/clientes/1');
    expect(put.request.method).toBe('PUT');
    put.flush({});

    api.patch('/clientes/1', { activo: false }).subscribe();
    const patch = http.expectOne(environment.apiUrl + '/clientes/1');
    expect(patch.request.method).toBe('PATCH');
    patch.flush({});

    api.delete('/clientes/1').subscribe();
    const del = http.expectOne(environment.apiUrl + '/clientes/1');
    expect(del.request.method).toBe('DELETE');
    del.flush({});
  });

  it('solicita archivos como Blob', () => {
    api.blob('/archivos/informe.pdf').subscribe((r) => expect(r).toBeInstanceOf(Blob));
    const req = http.expectOne(environment.apiUrl + '/archivos/informe.pdf');
    expect(req.request.responseType).toBe('blob');
    req.flush(new Blob(['pdf']));
  });

  it('construye mensajes útiles para errores HTTP y no HTTP', () => {
    expect(api.mensaje(new HttpErrorResponse({
      status: 400, error: { mensaje: 'Dato inválido' },
    }))).toBe('Dato inválido');
    expect(api.mensaje(new HttpErrorResponse({
      status: 500, error: { message: 'Fallo interno' },
    }))).toBe('Fallo interno');
    expect(api.mensaje(new HttpErrorResponse({ status: 404 }))).toBe('Error HTTP 404');
    expect(api.mensaje(new Error('x'))).toBe('Ocurrió un error');
  });
});
