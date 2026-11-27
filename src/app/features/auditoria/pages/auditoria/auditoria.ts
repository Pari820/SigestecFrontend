import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ApiService } from '../../../../core/services/api.service';

interface EventoAuditoria {
  id: number;
  fecha: string;
  usuario: string;
  accion: string;
  entidad: string;
  entidadId: number | null;
  detalle: string | null;
  requestId: string | null;
}
interface PaginaAuditoria {
  contenido: EventoAuditoria[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
  ultima: boolean;
}

@Component({
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './auditoria.html',
  styleUrl: './auditoria.css',
})
export class Auditoria implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly api = inject(ApiService);
  registros = signal<PaginaAuditoria | null>(null);
  cargando = signal(false);
  error = signal('');
  usuario = '';
  accion = '';
  desde = '';
  hasta = '';
  pagina = 0;
  tamanio = 20;
  readonly acciones = [
    'LOGIN_EXITOSO', 'LOGIN_FALLIDO', 'SOLICITUD_REGISTRADA',
    'COTIZACION_REGISTRADA', 'COTIZACION_ACTUALIZADA', 'COTIZACION_ESTADO',
    'ORDEN_COMPRA_REGISTRADA', 'PERSONAL_ASIGNADO', 'PERSONAL_REASIGNADO',
    'ORDEN_TRABAJO_PROGRAMADA', 'ATS_REGISTRADO', 'ATS_REVISADO',
    'EJECUCION_REGISTRADA', 'INFORME_TECNICO_REGISTRADO', 'CONFORMIDAD_REGISTRADA',
    'MOVIMIENTO_MATERIAL', 'MOVIMIENTO_HERRAMIENTA',
    'MATERIAL_REGISTRADO', 'HERRAMIENTA_REGISTRADA',
    'CLIENTE_REGISTRADO', 'TIPO_SERVICIO_REGISTRADO', 'PERSONAL_REGISTRADO',
    'REGISTRO_ACTUALIZADO', 'DOCUMENTO_ACTUALIZADO',
    'REGISTRO_REACTIVADO', 'REGISTRO_CANCELADO', 'REGISTRO_ELIMINADO',
  ];

  ngOnInit(): void { this.cargar(); }

  filtrar(): void {
    this.pagina = 0;
    this.cargar();
  }

  limpiar(): void {
    this.usuario = '';
    this.accion = '';
    this.desde = '';
    this.hasta = '';
    this.filtrar();
  }

  irPagina(valor: number): void {
    const total = this.registros()?.totalPaginas ?? 0;
    if (valor < 0 || valor >= total || this.cargando()) return;
    this.pagina = valor;
    this.cargar();
  }

  cambiarTamanio(): void {
    this.pagina = 0;
    this.cargar();
  }

  cargar(): void {
    if (this.desde && this.hasta && this.desde > this.hasta) {
      this.error.set('La fecha Desde no puede ser posterior a Hasta.');
      return;
    }
    let params = new HttpParams()
      .set('pagina', this.pagina)
      .set('tamanio', this.tamanio);
    if (this.usuario.trim()) params = params.set('usuario', this.usuario.trim());
    if (this.accion) params = params.set('accion', this.accion);
    if (this.desde) params = params.set('desde', this.desde);
    if (this.hasta) params = params.set('hasta', this.hasta);
    this.cargando.set(true);
    this.error.set('');
    this.http.get<PaginaAuditoria>(environment.apiUrl + '/auditoria', { params }).subscribe({
      next: r => {
        this.registros.set(r);
        this.cargando.set(false);
      },
      error: e => {
        this.error.set(this.api.mensaje(e));
        this.cargando.set(false);
      },
    });
  }
}
