
> **Nueva revisión de seguridad de registros:** consulta [GUIA_GESTION_SEGURA.md](GUIA_GESTION_SEGURA.md) para ver las operaciones permitidas y los bloqueos de eliminación/cancelación que protegen los procesos.
## Recuperación de contraseña (nueva)

Lee **[GUIA_RECUPERACION_CORREO.md](GUIA_RECUPERACION_CORREO.md)** para utilizar «¿Olvidaste tu contraseña?». Necesitas el backend actualizado y SMTP configurado en IntelliJ.

**Estructura reorganizada:** consulta [`REORGANIZACION_ESTRUCTURA.md`](REORGANIZACION_ESTRUCTURA.md) para ver las carpetas `core`, `features`, `layout` y `shared` usadas en esta entrega.

# SIGESTEC — Frontend actualizado CU01–CU06

Se conserva la apariencia, layout, CSS y rutas originales de Angular. **No se añadieron casos de uso nuevos**. Los cambios están dentro de los formularios ya existentes:

- CU01: carga opcional de PDF de solicitud.
- CU02: lista de detalles por cotización (cantidad/precio/importe), subtotal e IGV calculados y PDF opcional; varias cotizaciones por solicitud.
- CU03: detalles de orden de compra precargados desde la cotización, ajustables según el documento del cliente, y PDF obligatorio.
- CU04: personal con técnico responsable, técnicos adicionales, SSOMA y apoyo.
- CU05: se mantiene la programación y carga de PT, IPER y croquis; backend registra sus URLs.
- CU06: se mantiene la pantalla ATS y las etapas se leen como registros relacionados, no como JSON persistido; PDF opcional.

No se implementó CU07 ni ninguna nueva pantalla.

## Ejecución

Instala Node.js compatible con Angular 22 y ejecuta:

```bash
npm ci
npm start
```

Abre `http://localhost:4200`; el backend debe estar en `http://localhost:8080`.

**Importante:** la BD antigua de Iteración 1 y el nuevo modelo ADS no son intercambiables. El backend se preparó para el nuevo esquema y requiere datos de personas, cargos y usuarios en las tablas correspondientes. Consulta el README del backend y la matriz de correspondencia del paquete combinado.


## Ampliación CU07–CU12

Consultar `README_ITERACION2_CU07_CU12.md` para instrucciones, reglas de negocio, scripts Oracle y pruebas.
