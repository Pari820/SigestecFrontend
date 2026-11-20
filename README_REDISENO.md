# SIGESTEC ACOIEL SAC — Frontend rediseñado, Iteración 1

## Qué cambió
- Login de fondo blanco con logo de ACOIEL SAC proporcionado como referencia por la usuaria.
- Barra superior color verde petróleo, usuario/sede/avatar, y barra lateral con secciones desplegables.
- Tres subopciones de Gestión comercial; dos de Planificación; Elaboración del ATS en su sección.
- Listado, registro y detalle en rutas separadas para CU_01 a CU_06; filtros, búsquedas y paginación visual por cliente.
- Formularios separados de pantalla completa, no modales; botones Cancelar y Guardar.
- Se conserva la URL de API `http://localhost:8080/api/v1`, la seguridad por roles y los contratos existentes de Spring Boot.
- Opciones de ejecución y almacén marcadas como «Iteración 2», sin crear funcionalidades inexistentes.

## Instalación
1. Descomprimir el ZIP y entrar en `sigestec-frontend` (carpeta que contiene `package.json`).
2. En VS Code: `npm ci` y `npm start`.
3. Abrir `http://localhost:4200`.
4. Mantener Spring Boot con Oracle en `http://localhost:8080`.

## Notas funcionales
- Las fechas y estados iniciales de las solicitudes se fijan en el backend; el formulario los muestra solo como lectura.
- Para solicitudes, órdenes de compra y ATS, la API actual **no tiene endpoint de edición**; el botón de edición se muestra desactivado de manera explícita.
- Cotizaciones y asignaciones disponen de navegación de edición; programación admite programación/reprogramación respetando las reglas del servidor.
- La aprobación de ATS es CU_07, por tanto NO se implementa en iteración 1.
- Recuperación de contraseña no implementada: el enlace informa al usuario cómo solicitarla al administrador; no habilita cambios inseguros.
- Las listas están paginadas en memoria (5 registros por pantalla); para grandes volúmenes convendría paginación real en backend.
- Este archivo solo actualiza el frontend. No modifica las tablas ni el backend que ya ejecuta el usuario.

## Roles
- ADMIN: todos los módulos de la iteración 1.
- GERENTE: solicitudes, cotizaciones, órdenes de compra y parámetros de clientes y tipos de servicio.
- SUPERVISOR: asignación, programación y personal.
- SSOMA: elaboración de ATS.

## Validación sugerida
1. Iniciar sesión con cuenta de prueba preexistente y comprobar menú.
2. Registrar cliente y tipo de servicio en Parámetros.
3. Crear solicitud, cotización, aceptarla y registrar OC con PDF.
4. Asignar técnico y SSOMA, programar con documentación y crear ATS.
5. Verificar que cada acción vuelve al listado y se refleja en Oracle.



## Ajustes de la pantalla de inicio

- Panel de control sin banner de incremento, sin subtítulos, sin descripciones y sin códigos de casos de uso.
- Seis accesos directos presentados solo por nombre; los permisos existentes se respetan.
- El menú lateral no contiene Ejecución del servicio, Gestión de almacén ni Reportes.
- Se retiraron las referencias académicas visibles de Parámetros y de la elaboración del ATS.
- La lógica de la API REST y las rutas de los formularios no se modificaron.
