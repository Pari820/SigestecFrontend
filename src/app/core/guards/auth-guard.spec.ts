import { describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth-service';
import { authGuard } from './auth-guard';

describe('authGuard', () => {
  it('permite el acceso con sesión vigente', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: { sesion: () => ({ expiraEn: Date.now() + 10_000 }) } }],
    });
    expect(TestBed.runInInjectionContext(() => authGuard({} as any, {} as any))).toBe(true);
  });

  it('redirige al login si no existe sesión vigente', () => {
    const router = { parseUrl: vi.fn((url: string) => ({ url })) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { sesion: () => null } },
        { provide: Router, useValue: router },
      ],
    });
    expect(TestBed.runInInjectionContext(() => authGuard({} as any, {} as any))).toEqual({ url: '/login' });
    expect(router.parseUrl).toHaveBeenCalledWith('/login');
  });
});
