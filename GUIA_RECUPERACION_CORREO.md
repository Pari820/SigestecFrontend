# Frontend — Recuperación de contraseña SIGESTEC

**Base:** `SIGESTEC-Frontend-Temporizador-Cambio-Clave.zip` (Angular reorganizado).

## Rutas nuevas

- `/recuperar-clave`: el usuario introduce su `username` (por ejemplo `gerente`, `ssoma`). No requiere login.
- `/restablecer-clave?token=...`: abre el enlace recibido por correo; el formulario permite establecer una nueva contraseña sin conocer la anterior.

Ambas pantallas usan los servicios de `src/app/core/auth/auth-service.ts` y los endpoints `/api/v1/auth/recuperar-clave` y `/api/v1/auth/restablecer-clave` del backend.

La opción anterior **Cambiar contraseña** (dentro de la sesión) y el temporizador JWT se mantienen.

En la versión local `oracle-dev`, el backend enruta todos los enlaces de recuperación al buzón de pruebas `sigestec835@gmail.com`. Esto es temporal y no debe utilizarse para cuentas reales en producción.

## Ejecutar

1. Mantener iniciado Oracle Docker y Spring Boot con perfil `oracle-dev` y variables SMTP de Gmail.
2. En la carpeta `sigestec-frontend`: `npm install` y `npm start`.
3. Entrar en `http://localhost:4200/login` y hacer clic en **¿Olvidaste tu contraseña?**.

Si se muestra «Servicio de correo no configurado», configura `SMTP_USERNAME`, `SMTP_PASSWORD` (contraseña de aplicación de Gmail) y `SMTP_REMITENTE_EMAIL` en IntelliJ. No necesitas Brevo.

**Importante:** si la URL llegó por correo, abrirla en el mismo equipo donde funciona Angular en `localhost:4200`. Se elimina el token de la barra de direcciones después de abrir la pantalla; no refresques esa pantalla antes de terminar el restablecimiento.
