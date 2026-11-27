import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../auth/auth-service';
import { authInterceptor } from './auth-interceptor';
import { environment } from '../../../environments/environment';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  const auth = { sesion: vi.fn(), salir: vi.fn() };

  beforeEach(() => {
    auth.sesion.mockReturnValue(null);
    auth.salir.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: auth },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('añade el token Bearer a las peticiones de la API', () => {
    auth.sesion.mockReturnValue({ token: 'secreto' });
    httpClient.get(environment.apiUrl + '/clientes').subscribe();
    const req = http.expectOne(environment.apiUrl + '/clientes');
    expect(req.request.headers.get('Authorization')).toBe('Bearer secreto');
    req.flush([]);
  });

  it('no añade autorización a URLs externas', () => {
    auth.sesion.mockReturnValue({ token: 'secreto' });
    httpClient.get('https://ejemplo.test/recurso').subscribe();
    const req = http.expectOne('https://ejemplo.test/recurso');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('cierra la sesión ante 401 de la API salvo en login', () => {
    httpClient.get(environment.apiUrl + '/clientes').subscribe({ error: () => undefined });
    http.expectOne(environment.apiUrl + '/clientes').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.salir).toHaveBeenCalledOnce();

    httpClient.post(environment.apiUrl + '/auth/login', {}).subscribe({ error: () => undefined });
    http.expectOne(environment.apiUrl + '/auth/login').flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(auth.salir).toHaveBeenCalledOnce();
  });

  it('no cierra la sesión cuando el 401 corresponde al despacho /error', () => {
    httpClient.get(environment.apiUrl + '/clientes').subscribe({ error: () => undefined });
    http.expectOne(environment.apiUrl + '/clientes').flush(
      { ruta: '/error' }, { status: 401, statusText: 'Unauthorized' },
    );
    expect(auth.salir).not.toHaveBeenCalled();
  });
});
