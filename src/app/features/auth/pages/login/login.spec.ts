import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Login } from './login';
import { AuthService } from '../../../../core/auth/auth-service';
import { ApiService } from '../../../../core/services/api.service';

describe('Login', () => {
  const auth = { login: vi.fn(), iniciar: vi.fn() };
  const api = { mensaje: vi.fn(() => 'Error del servidor') };

  function crear(queryParam: string | null = null) {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: ApiService, useValue: api },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: () => queryParam } } } },
      ],
    });
    const fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
    return { fixture, component: fixture.componentInstance };
  }

  it('detecta si la contraseña fue actualizada', () => {
    const { component } = crear('1');
    expect(component.claveActualizada).toBe(true);
  });

  it('valida usuario y contraseña antes de llamar al servicio', () => {
    const { component } = crear();
    component.entrar();
    expect(component.error()).toBe('Ingresa tu usuario y contraseña.');
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('envía credenciales normalizadas y procesa el inicio de sesión', () => {
    const respuesta = {
      token: 't', rol: 'GERENTE', nombre: 'Ana', username: 'ana', expiraEnSegundos: 3600,
    };
    auth.login.mockReturnValueOnce(of(respuesta));
    const { component } = crear();
    component.username = ' ana ';
    component.password = 'clave';
    component.entrar();
    expect(auth.login).toHaveBeenCalledWith('ana', 'clave');
    expect(auth.iniciar).toHaveBeenCalledWith(respuesta);
    expect(component.cargando()).toBe(false);
    expect(component.error()).toBe('');
  });

  it('muestra un mensaje específico para credenciales incorrectas', () => {
    auth.login.mockReturnValueOnce(throwError(() => ({ status: 401, name: 'HttpErrorResponse' })));
    const { component } = crear();
    component.username = 'ana';
    component.password = 'incorrecta';
    component.entrar();
    expect(component.error()).toBe('Usuario o contraseña incorrectos.');
    expect(component.cargando()).toBe(false);
  });

  it('muestra un mensaje específico cuando no hay conexión', () => {
    auth.login.mockReturnValueOnce(throwError(() => ({ status: 0, name: 'HttpErrorResponse' })));
    const { component } = crear();
    component.username = 'ana';
    component.password = 'clave';
    component.entrar();
    expect(component.error()).toContain('No se puede conectar');
  });

  it('delega otros errores al ApiService', () => {
    auth.login.mockReturnValueOnce(throwError(() => ({ status: 500, name: 'HttpErrorResponse' })));
    const { component } = crear();
    component.username = 'ana';
    component.password = 'clave';
    component.entrar();
    expect(component.error()).toBe('Error del servidor');
  });
});
