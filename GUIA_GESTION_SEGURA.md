# SIGESTEC — Acciones seguras en Angular

Esta entrega parte de `SIGESTEC-Frontend-Recuperacion-SMTP(1).zip` y conserva la estructura `core/features/layout/shared`, la autenticación JWT, el temporizador y la recuperación de contraseñas por Gmail SMTP.

## Qué aparece en las pantallas

El componente reutilizable `src/app/shared/components/acciones-seguras` agrega las opciones **Ver**, **Editar**, **Eliminar**, **Cancelar**, **Inactivar** y **Reactivar**, según la naturaleza del módulo. Los cambios se hacen en un diálogo con solo los campos permitidos, no en una edición libre de todas las columnas.

- Un botón no garantiza permiso: Spring Boot comprueba el rol y las dependencias antes de modificar Oracle.
- Si el registro participa en otro proceso, aparece la razón exacta de por qué no puede eliminarse o cancelarse.
- Las opciones originales de ver detalle, editar cotización, cambiar equipo y reprogramar OT se mantienen.
- Para los PDF enviados, aprobaciones ATS, conformidades y movimientos de almacén se conserva el historial y no se ofrece borrar por seguridad.

Revisa también `GUIA_GESTION_SEGURA.md` del backend, que incluye la matriz completa de operaciones y los casos de prueba recomendados.

## Ejecución

```bash
npm install
npm start
```

El backend debe estar activo en `localhost:8080` y Angular en `localhost:4200`. Mantén los cinco usuarios, contraseñas y roles actuales. Los componentes nuevos no modifican datos hasta que haces clic explícitamente en Guardar, Eliminar, Cancelar, Inactivar o Reactivar y se cumplen las reglas del backend.
