import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from './auth-service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
  });

  afterEach(() => {
    http.verify();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('inicia sin sesión cuando no hay datos almacenados', () => {
    expect(service.sesion()).toBeNull();
  });

  it('recupera una sesión vigente desde sessionStorage', () => {
    const sesion = {
      token: 'token-valido', rol: 'GERENTE', nombre: 'Ana',
      username: 'ana', expiraEn: Date.now() + 60_000,
    };
    sessionStorage.setItem('sigestec_sesion', JSON.stringify(sesion));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    const nuevaInstancia = TestBed.inject(AuthService);
    expect(nuevaInstancia.sesion()).toEqual(sesion);
  });

  it('elimina una sesión expirada', () => {
    sessionStorage.setItem('sigestec_sesion', JSON.stringify({
      token: 'vencido', rol: 'GERENTE', nombre: 'Ana', username: 'ana', expiraEn: Date.now() - 1,
    }));
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    expect(TestBed.inject(AuthService).sesion()).toBeNull();
    expect(sessionStorage.getItem('sigestec_sesion')).toBeNull();
  });

  it('maneja datos de sesión JSON inválidos sin lanzar una excepción', () => {
    sessionStorage.setItem('sigestec_sesion', '{no-json');
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    expect(TestBed.inject(AuthService).sesion()).toBeNull();
  });

  it('envía las credenciales al endpoint de login', () => {
    service.login('ana', 'clave').subscribe();
    const req = http.expectOne(environment.apiUrl + '/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ username: 'ana', password: 'clave' });
    req.flush({ token: 't' });
  });

  it('guarda la sesión, actualiza la señal y navega al inicio', () => {
    service.iniciar({
      token: 'abc', rol: 'GERENTE', nombre: 'Ana', username: 'ana', expiraEnSegundos: 120,
    });
    expect(service.sesion()?.token).toBe('abc');
    expect(service.sesion()?.expiraEn).toBeGreaterThan(Date.now());
    expect(JSON.parse(sessionStorage.getItem('sigestec_sesion') || '{}').username).toBe('ana');
    expect(router.navigateByUrl).toHaveBeenCalledWith('/inicio');
  });

  it('envía las solicitudes de cambio y recuperación de clave', () => {
    service.cambiarClave('anterior', 'nueva').subscribe();
    const cambio = http.expectOne(environment.apiUrl + '/auth/cambiar-clave');
    expect(cambio.request.body).toEqual({ claveActual: 'anterior', claveNueva: 'nueva' });
    cambio.flush({ mensaje: 'Actualizada' });

    service.solicitarRecuperacion('ana').subscribe();
    const recuperacion = http.expectOne(environment.apiUrl + '/auth/recuperar-clave');
    expect(recuperacion.request.body).toEqual({ username: 'ana' });
    recuperacion.flush({ mensaje: 'Enviado' });

    service.restablecerClave('token', 'nueva').subscribe();
    const restablecer = http.expectOne(environment.apiUrl + '/auth/restablecer-clave');
    expect(restablecer.request.body).toEqual({ token: 'token', claveNueva: 'nueva' });
    restablecer.flush({ mensaje: 'Restablecida' });
  });

  it('cierra sesión y dirige al login según el caso', () => {
    service.iniciar({
      token: 'abc', rol: 'GERENTE', nombre: 'Ana', username: 'ana', expiraEnSegundos: 120,
    });
    service.salir(true);
    expect(service.sesion()).toBeNull();
    expect(sessionStorage.getItem('sigestec_sesion')).toBeNull();
    expect(router.navigateByUrl).toHaveBeenLastCalledWith('/login?claveActualizada=1');
  });

  it('valida vigencia y permisos de rol', () => {
    expect(service.vigente()).toBe(false);
    expect(service.puede(['GERENTE'])).toBe(false);
    service.iniciar({
      token: 'abc', rol: 'SUPERVISOR', nombre: 'Luis', username: 'luis', expiraEnSegundos: 120,
    });
    expect(service.vigente()).toBe(true);
    expect(service.puede(['SUPERVISOR'])).toBe(true);
    expect(service.puede(['GERENTE'])).toBe(false);
    service.iniciar({
      token: 'admin', rol: 'ADMIN', nombre: 'Admin', username: 'admin', expiraEnSegundos: 120,
    });
    expect(service.puede(['GERENTE'])).toBe(true);
  });
});
