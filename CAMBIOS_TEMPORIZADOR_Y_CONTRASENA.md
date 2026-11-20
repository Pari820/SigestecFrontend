# Nuevas funciones: SIGESTEC Angular

- Se conserva la estructura `core / features / layout / shared` del proyecto organizado.
- El encabezado muestra `Sesión: hh:mm:ss` o `mm:ss` antes de «Usuario ssoma» y actualiza cada segundo.
- En los últimos 5 minutos se destaca el tiempo. Cuando llega a cero, se cierra sesión automáticamente.
- El tiempo lo determina el backend con `expiraEnSegundos` y no se cambia en Angular.
- En el menú izquierdo aparece **Cambiar contraseña** para los usuarios autenticados.
- La página pide contraseña actual, nueva y confirmación. La solicitud está protegida por JWT.
- Tras cambiar la clave se cierra sesión y se muestra un aviso de éxito en el login.
- La ayuda «¿Olvidaste tu contraseña?» continúa sin un mecanismo de recuperación automática.
