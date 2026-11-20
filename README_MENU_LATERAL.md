# SIGESTEC — Menú lateral conforme al prototipo

## Archivos actualizados

- `src/app/layout/main-layout/layout.ts`: agrupación independiente de seis módulos del menú, acordeón, rutas activas y menú compacto.
- `src/app/layout/main-layout/layout.html`: jerarquía del menú, iconos SVG integrados, controles inferiores y vista móvil.
- `src/styles.css`: ajustes visuales del menú lateral, conservando colores y formularios originales.

## Secciones y rutas

- Inicio: `/inicio`.
- Gestión comercial: solicitudes, cotizaciones y órdenes de compra.
- Planificación del servicio: asignación de personal y programación de OT.
- Gestión del ATS: elaboración y aprobación del ATS.
- Ejecución del servicio: registro de ejecución, informe técnico y conformidad.
- Gestión de almacén: movimientos de materiales y herramientas.
- Parámetros: clientes, tipos de servicio y personal, según el rol.
- Reportes: elemento visual con aviso informativo; la funcionalidad no está implementada.
- Cerrar sesión: conserva el flujo existente de autenticación.

Los módulos siguen siendo visibles según los permisos existentes. El administrador puede verlos todos.
El botón superior del lateral compacta/despliega el menú en escritorio y lo cierra en móvil.

## Ejecutar el frontend

Desde la carpeta que contiene `package.json` y `angular.json`:

```powershell
npm ci
npm start
```

Abrir `http://localhost:4200/login`. Ejecutar Spring Boot en puerto 8080 para iniciar sesión.

## Alcance de la modificación

Solo se rediseñó la navegación lateral. No se alteraron endpoints, casos de uso, datos, formularios ni backend.
