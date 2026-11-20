# SIGESTEC Frontend — organización tipo PharmaFrontend

La organización utiliza `core`, `features`, `layout` y `shared`.

## Estructura

- `src/app/core/auth`: sesión, autenticación y modelo de sesión.
- `src/app/core/config`: roles y datos del menú del inicio.
- `src/app/core/guards`: guard de autenticación y de roles.
- `src/app/core/interceptors`: interceptor que adjunta el token y cierra sesión ante 401.
- `src/app/core/services`: servicio HTTP común (`ApiService`).
- `src/app/features/<modulo>/pages/<pantalla>`: componente `.ts`, plantilla `.html` y hoja `.css`.
- `src/app/features/<modulo>/<modulo>.routes.ts`: rutas propias del módulo.
- `src/app/layout/main-layout`: estructura de menú y cabecera.
- `src/app/shared/pages/pagina-base.ts`: clase base común para listados, filtros y paginación.
- `src/app/shared/utils/pantalla-route.ts`: utilidad de rutas conservando el valor original `vista`.

## Conservación de funcionalidades

- Se preservan las URLs, permisos por rol, nombres de clases y endpoints HTTP.
- El CSS visual original continúa en `src/styles.css`; los `.css` individuales están preparados para futuros estilos específicos.
- Algunas pantallas aún usan **un mismo componente** para `listado`, `nuevo`, `editar` y `detalle`, tal como estaba en el proyecto original; dividirlas en varios componentes sería otra refactorización con cambios de lógica, y no se hizo aquí.
- Los componentes que tenían HTML escrito dentro del TS se separaron en sus respectivas plantillas `.html`.
- No se añadieron servicios/modelos funcionales vacíos o no utilizados por las pantallas. El servicio HTTP existente permanece compartido en `core/services`.

## Ejecución

```bash
npm install
npm start
```

Para compilar:

```bash
npm run build
```

Nota: requiere una versión de Node.js compatible con Angular 22.
