# SIGESTEC — Frontend

## Descripción del proyecto

**SIGESTEC (Sistema de Gestión de Servicios Técnicos)** es una aplicación web desarrollada para la empresa ACOIEL SAC, dedicada a brindar servicios de ingeniería eléctrica y mantenimiento industrial.

El sistema permite administrar y supervisar los procesos comerciales, operativos y técnicos de la empresa mediante una plataforma centralizada.

Su propósito es mejorar la organización de la información, facilitar el seguimiento de los servicios y mantener la trazabilidad de las operaciones realizadas.

## Tecnologías utilizadas

- **Angular:** framework para el desarrollo de la aplicación web.
- **TypeScript:** lenguaje de programación principal.
- **HTML5:** estructura de las interfaces.
- **CSS3:** estilos y presentación visual.
- **Angular Router:** navegación entre módulos.
- **Angular HttpClient:** comunicación con la API REST.
- **JWT:** autenticación mediante tokens.
- **Node.js y npm:** administración de dependencias y ejecución del proyecto.

### Tecnologías del backend

El frontend se integra con una API REST desarrollada utilizando:

- Java 21
- Spring Boot 3.5.7
- Spring Security
- Spring Data JPA
- Oracle Database

## Arquitectura del frontend

El proyecto utiliza una arquitectura modular para organizar las funcionalidades y facilitar su mantenimiento.

### Organización principal

- **core:** servicios generales, autenticación, interceptores, guards y configuración.
- **features:** módulos funcionales del sistema.
- **layout:** estructura visual de la aplicación, encabezado, menú lateral y navegación.
- **shared:** componentes y elementos reutilizables.
- **environments:** configuración de los entornos de ejecución.

Cada módulo funcional agrupa sus componentes, páginas, servicios y rutas correspondientes.

## Módulos del sistema

### 1. Autenticación y seguridad

Permite controlar el acceso a SIGESTEC mediante credenciales de usuario.

Funcionalidades:

- Inicio de sesión.
- Autenticación mediante JWT.
- Control de acceso según roles.
- Protección de rutas.
- Gestión de sesiones.
- Visualización del tiempo restante de sesión.
- Cierre de sesión.
- Cambio de contraseña.
- Recuperación de contraseña mediante correo electrónico.

### 2. Gestión de clientes

Permite registrar y administrar la información de las empresas que solicitan servicios técnicos.

Incluye consulta de clientes, actualización de información y control de registros activos e inactivos.

### 3. Solicitudes de servicio

Permite registrar las solicitudes realizadas por los clientes.

Incluye:

- Registro de nuevas solicitudes.
- Selección de clientes.
- Selección del tipo de servicio.
- Descripción del trabajo solicitado.
- Consulta y actualización de información.
- Seguimiento del estado de las solicitudes.

### 4. Cotizaciones

Permite elaborar presupuestos asociados a solicitudes de servicio.

Incluye:

- Registro de cotizaciones.
- Asociación con solicitudes.
- Detalle de servicios y costos.
- Cálculo de subtotal, IGV y total.
- Consulta de cotizaciones.
- Registro de aceptación o rechazo.
- Control de estados.

### 5. Órdenes de compra

Permite administrar las órdenes de compra correspondientes a los servicios aceptados por los clientes.

Incluye:

- Registro de órdenes de compra.
- Asociación con cotizaciones aceptadas.
- Registro de fechas y montos.
- Gestión de documentos PDF.
- Consulta y seguimiento de órdenes.
- Control de anulación según el estado del proceso.

### 6. Órdenes de trabajo y programación

Permite organizar los trabajos derivados de los procesos comerciales.

Incluye:

- Consulta de órdenes de trabajo.
- Asignación de personal.
- Programación de actividades.
- Seguimiento de servicios.
- Control de estados operativos.

### 7. Análisis de Trabajo Seguro (ATS)

Permite gestionar la información relacionada con la seguridad de las actividades técnicas.

Incluye:

- Registro de análisis de trabajo seguro.
- Identificación de riesgos.
- Medidas de control.
- Equipos de protección personal.
- Consulta y aprobación de ATS.

### 8. Ejecución de servicios

Permite registrar y consultar información relacionada con los trabajos realizados.

Incluye el seguimiento de las actividades técnicas y sus evidencias.

### 9. Informes técnicos

Permite gestionar los informes relacionados con la ejecución de servicios.

Incluye el registro de información técnica, observaciones y documentos de respaldo.

### 10. Conformidad de servicios

Permite consultar y gestionar los documentos que acreditan la conformidad de los servicios realizados.

### 11. Gestión de almacén

Permite administrar materiales, herramientas y equipos utilizados en las operaciones de la empresa.

Incluye el registro y consulta de información de inventario y movimientos de almacén.

## Roles y permisos

SIGESTEC cuenta con un sistema de autorización basado en roles.

| Rol | Función principal |
|---|---|
| Administrador | Administración y configuración del sistema |
| Gerente | Gestión de procesos comerciales |
| Supervisor | Coordinación y seguimiento operativo |
| SSOMA | Gestión de seguridad y análisis de riesgos |
| Almacenero | Administración de materiales y herramientas |

Las funcionalidades disponibles dependen del rol asignado al usuario.

La validación de permisos también se realiza en el backend para proteger las operaciones del sistema.

## Flujo principal del sistema

El proceso general de SIGESTEC comprende las siguientes etapas:

1. Registro de solicitud de servicio.
2. Elaboración de cotización.
3. Aceptación de cotización.
4. Registro de orden de compra.
5. Generación y programación de orden de trabajo.
6. Asignación de personal.
7. Registro y aprobación del ATS.
8. Ejecución del servicio.
9. Elaboración del informe técnico.
10. Registro de conformidad del servicio.

Las etapas mantienen relaciones entre sus registros para facilitar el seguimiento de las operaciones.

## Requisitos para ejecutar el frontend

- Node.js y npm compatibles con la versión de Angular del proyecto.
- Visual Studio Code u otro editor compatible.
- Angular CLI compatible con el proyecto.
- Backend SIGESTEC disponible.
- Conexión a Oracle Database configurada en el backend.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Pari820/SigestecFrontend.git
```

### 2. Ingresar al proyecto

```bash
cd SigestecFrontend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm start
```

### 5. Abrir la aplicación

Acceder desde el navegador a:

```text
http://localhost:4200
```

## Conexión con el backend

El frontend consume los endpoints REST proporcionados por SIGESTEC Backend.

En el entorno local de desarrollo, el backend se ejecuta en:

```text
http://localhost:8080
```

La configuración de comunicación debe coincidir con la dirección de la API REST.

La aplicación Angular no se conecta directamente con Oracle Database. Las operaciones de consulta, registro y actualización se realizan a través del backend.

## Seguridad

SIGESTEC incorpora mecanismos de protección de acceso y control de operaciones:

- Autenticación JWT.
- Restricción de rutas según el usuario.
- Interceptores HTTP.
- Control de expiración de sesión.
- Validación de permisos.
- Recuperación de contraseña.
- Restricciones para modificar o eliminar registros vinculados a otros procesos.

Estas medidas contribuyen a proteger la integridad y confidencialidad de la información.

## Repositorios del proyecto

**Frontend:**

https://github.com/Pari820/SigestecFrontend

**Backend:**

https://github.com/Pari820/SigestecBackend

## Proyecto académico

**SIGESTEC — Sistema de Gestión de Servicios Técnicos**

Proyecto académico de Ingeniería de Sistemas.

**Empresa de aplicación:** ACOIEL SAC.

**Propósito:** desarrollar una solución informática que contribuya a la organización, automatización y seguimiento de los procesos comerciales y técnicos de la empresa.