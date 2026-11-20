import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

type Campo = { key: string; label: string; largo?: boolean; tipo?: 'number' };

type Configuracion = {
  campos: Campo[];
  permitirEditar?: boolean;
  permitirEliminar?: boolean;
  permitirCancelar?: boolean;
  inactivar?: boolean;
  permitirReactivar?: boolean;
  aviso?: string;
};

/** Solo admite campos específicos. Los permisos y las relaciones se verifican siempre en Spring Boot. */
const MODULOS: Record<string, Configuracion> = {
  solicitudes: {
    campos: [
      { key: 'descripcion', label: 'Descripción', largo: true },
      { key: 'observaciones', label: 'Observaciones', largo: true },
      { key: 'lugarServicio', label: 'Lugar del servicio' },
    ],
    permitirEditar: true, permitirEliminar: true, permitirCancelar: true, permitirReactivar: true,
  },
  cotizaciones: {
    campos: [{ key: 'numero', label: 'Número' }, { key: 'estado', label: 'Estado' }],
    permitirEliminar: true, permitirCancelar: true,
    aviso: 'La edición de importes y detalles se hace desde el formulario completo de Cotizaciones.',
  },
  compras: {
    campos: [{ key: 'numero', label: 'Número de OC' }, { key: 'estado', label: 'Estado' }],
    permitirEditar: true, permitirCancelar: true, permitirReactivar: true,
    aviso: 'Una OC formal nunca se elimina. Solo puede anularse si todavía no tiene orden de trabajo.',
  },
  'ordenes-trabajo': {
    campos: [{ key: 'numero', label: 'Número de OT' }, { key: 'estado', label: 'Estado' }, { key: 'lugar', label: 'Lugar' }],
    permitirCancelar: true, permitirReactivar: true,
    aviso: 'El personal se edita en Asignaciones y el horario en Programaciones. La OT queda protegida si hay ATS, documentos, movimientos o ejecución.',
  },
  ats: {
    campos: [
      { key: 'condicionesArea', label: 'Condiciones del área', largo: true },
      { key: 'observaciones', label: 'Observaciones', largo: true },
    ],
    permitirEditar: true,
    aviso: 'No se puede borrar un ATS por seguridad. Si tiene aprobaciones o ejecución, tampoco se puede modificar.',
  },
  'aprobaciones-ats': {
    campos: [{ key: 'resultado', label: 'Resultado' }, { key: 'observaciones', label: 'Observaciones' }],
    aviso: 'Las aprobaciones y firmas constituyen evidencia histórica y no se eliminan ni editan directamente.',
  },
  ejecuciones: {
    campos: [
      { key: 'descripcion', label: 'Descripción', largo: true },
      { key: 'mediciones', label: 'Mediciones', largo: true },
      { key: 'observaciones', label: 'Observaciones', largo: true },
    ],
    permitirEditar: true,
    aviso: 'No se eliminan ejecuciones: conservan evidencia y consumo de materiales. Se permite corregir texto antes del informe.',
  },
  informes: {
    campos: [
      { key: 'diagnostico', label: 'Diagnóstico', largo: true },
      { key: 'trabajosRealizados', label: 'Trabajos realizados', largo: true },
      { key: 'conclusiones', label: 'Conclusiones', largo: true },
      { key: 'recomendaciones', label: 'Recomendaciones', largo: true },
    ],
    permitirEditar: true,
    aviso: 'El PDF enviado y sus evidencias no cambian automáticamente al corregir texto. No se edita después de la conformidad.',
  },
  conformidades: {
    campos: [{ key: 'numeroActa', label: 'Acta' }, { key: 'estadoConformidad', label: 'Estado' }, { key: 'observaciones', label: 'Observaciones' }],
    aviso: 'Las actas de conformidad firmadas son definitivas. Su corrección requiere un procedimiento documentado.',
  },
  clientes: {
    campos: [{ key: 'razonSocial', label: 'Razón social' }, { key: 'telefono', label: 'Teléfono' }, { key: 'correo', label: 'Correo' }],
    permitirEditar: true, permitirEliminar: true, inactivar: true, permitirReactivar: true,
  },
  'tipos-servicio': {
    campos: [{ key: 'nombre', label: 'Tipo de servicio' }, { key: 'descripcion', label: 'Descripción' }],
    permitirEditar: true, permitirEliminar: true, inactivar: true, permitirReactivar: true,
  },
  personal: {
    campos: [{ key: 'nombre', label: 'Nombre completo' }, { key: 'perfil', label: 'Perfil (no editable)' }],
    permitirEditar: true, permitirEliminar: true, inactivar: true, permitirReactivar: true,
    aviso: 'No es posible desactivar empleados con cuentas activas o asignaciones de trabajo.',
  },
  materiales: {
    campos: [{ key: 'nombre', label: 'Material' }, { key: 'unidadMedida', label: 'Unidad' }, { key: 'stockMinimo', label: 'Stock mínimo', tipo: 'number' }],
    permitirEditar: true, permitirEliminar: true, inactivar: true, permitirReactivar: true,
    aviso: 'El stock actual se ajusta solo mediante movimientos; no se modifica desde este formulario.',
  },
  herramientas: {
    campos: [{ key: 'nombre', label: 'Herramienta' }, { key: 'descripcion', label: 'Descripción' }],
    permitirEditar: true, permitirEliminar: true, inactivar: true, permitirReactivar: true,
    aviso: 'No se cambian directamente las cantidades ni se borra el historial de préstamos.',
  },
  'movimientos-materiales': {
    campos: [{ key: 'tipoMovimiento', label: 'Tipo' }, { key: 'cantidad', label: 'Cantidad' }],
    aviso: 'Los movimientos del inventario no se editan ni eliminan; la rectificación se hace con un movimiento compensatorio.',
  },
  'movimientos-herramientas': {
    campos: [{ key: 'tipoMovimiento', label: 'Tipo' }, { key: 'cantidad', label: 'Cantidad' }],
    aviso: 'Los préstamos y devoluciones son históricos; utiliza un movimiento compensatorio.',
  },
};

@Component({
  selector: 'app-acciones-seguras',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './acciones-seguras.html',
  styleUrl: './acciones-seguras.css',
})
export class AccionesSeguras {
  @Input({ required: true }) recurso = '';
  @Input({ required: true }) registro: any;
  @Output() actualizado = new EventEmitter<void>();
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  private readonly api = inject(ApiService);
  readonly error = signal('');
  readonly exito = signal('');
  readonly guardando = signal(false);
  readonly editando = signal(false);
  datos: Record<string, any> = {};
  get configuracion(): Configuracion { return MODULOS[this.recurso] || { campos: [] }; }
  get campos(): Campo[] { return this.configuracion.campos; }
  get activo(): boolean { return this.registro?.estado !== 'I' && this.registro?.activo !== false; }

  ver() {
    this.error.set(''); this.exito.set(''); this.editando.set(false);
    this.modal.nativeElement.showModal();
  }
  editar() {
    this.error.set(''); this.exito.set(''); this.editando.set(true);
    const campos = this.recurso === 'personal' ? this.campos.filter(c => c.key === 'nombre') : this.campos;
    this.datos = Object.fromEntries(campos.map(c => [c.key, this.registro?.[c.key] ?? '']));
    this.modal.nativeElement.showModal();
  }
  cerrar() { this.modal.nativeElement.close(); this.editando.set(false); }
  guardar() {
    this.error.set('');
    const datos = { ...this.datos };
    if (this.recurso === 'materiales' && datos['stockMinimo'] !== undefined)
      datos['stockMinimo'] = Number(datos['stockMinimo']);
    this.guardando.set(true);
    this.api.put<{ mensaje: string }>(`/gestion/${this.recurso}/${this.registro.id}`, datos).subscribe({
      next: (r) => { this.guardando.set(false); this.exito.set(r.mensaje); this.cerrar(); this.actualizado.emit(); },
      error: (e) => { this.guardando.set(false); this.error.set(this.api.mensaje(e)); },
    });
  }
  reactivar() {
    if (!window.confirm('¿Reactivar este registro conservando el historial existente?')) return;
    this.error.set(''); this.exito.set(''); this.guardando.set(true);
    this.api.patch<{ mensaje: string }>(`/gestion/${this.recurso}/${this.registro.id}/reactivar`, {}).subscribe({
      next: (r) => { this.guardando.set(false); this.exito.set(r.mensaje); this.actualizado.emit(); },
      error: (e) => { this.guardando.set(false); this.error.set(this.api.mensaje(e)); },
    });
  }
  retirar(accion: 'eliminar' | 'cancelar') {
    const baja = this.configuracion.inactivar;
    const nombre = baja ? 'inactivar' : accion === 'cancelar' ? 'cancelar' : 'eliminar definitivamente';
    if (!window.confirm(`¿Deseas ${nombre} este registro? SIGESTEC impedirá la operación si afecta a otros procesos.`)) return;
    this.error.set(''); this.exito.set(''); this.guardando.set(true);
    const ruta = `/gestion/${this.recurso}/${this.registro.id}`;
    const llamada = accion === 'eliminar'
      ? this.api.delete<{ mensaje: string }>(ruta)
      : this.api.patch<{ mensaje: string }>(ruta + '/cancelar', {});
    llamada.subscribe({
      next: (r) => { this.guardando.set(false); this.exito.set(r.mensaje); this.actualizado.emit(); },
      error: (e) => { this.guardando.set(false); this.error.set(this.api.mensaje(e)); },
    });
  }
}
