import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { rolesGuard } from './roles-guard';

describe('rolesGuard', () => {
  it('permite el acceso cuando el rol está autorizado', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { puede: (roles: string[]) => roles.includes('GERENTE') } }],
    });
    const route = { data: { roles: ['GERENTE'] } } as any;
    expect(TestBed.runInInjectionContext(() => rolesGuard(route, {} as any))).toBe(true);
  });

  it('redirige a acceso-denegado cuando el rol no está autorizado', () => {
    const router = { parseUrl: vi.fn((url: string) => ({ url })) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { puede: () => false } },
        { provide: Router, useValue: router },
      ],
    });
    const route = { data: { roles: ['ADMIN'] } } as any;
    expect(TestBed.runInInjectionContext(() => rolesGuard(route, {} as any))).toEqual({ url: '/acceso-denegado' });
  });

  it('usa una lista vacía si la ruta no define roles', () => {
    const auth = { puede: vi.fn(() => true) };
    TestBed.configureTestingModule({ providers: [{ provide: AuthService, useValue: auth }] });
    expect(TestBed.runInInjectionContext(() => rolesGuard({ data: {} } as any, {} as any))).toBe(true);
    expect(auth.puede).toHaveBeenCalledWith([]);
  });
});
