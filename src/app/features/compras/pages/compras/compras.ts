import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginaBase } from '../../../../shared/pages/pagina-base';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AccionesSeguras],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras extends PaginaBase implements OnInit {
  cotizaciones = signal<any[]>([]);
  form = {
    cotizacionId: null as number | null,
    numero: '',
    fechaEmision: '',
    montoTotal: 0,
  };
  pdf: File | null = null;
  detalles: {
    descripcion: string;
    cantidad: number;
    precioUnitario: number;
    unidadMedida: string;
  }[] = [];
  ngOnInit() {
    this.cargarItems('/ordenes-compra');
    this.api
      .get<any[]>('/cotizaciones')
      .subscribe({
        next: (x) => this.cotizaciones.set(x),
        error: (e) => this.error.set(this.api.mensaje(e)),
      });
  }
  override textoBusqueda(x: any) {
    return `${x.id} ${x.numero} ${x.cotizacion?.solicitud?.cliente?.razonSocial}`;
  }
  override estadoDe(x: any) {
    return x.cotizacion?.estado || '';
  }
  get aceptadas() {
    return this.cotizaciones().filter(
      (c) => c.estado === 'ACEPTADA' && !this.items().some((oc) => oc.cotizacion.id === c.id),
    );
  }
  get actual() {
    return this.cotizaciones().find((c) => c.id === this.form.cotizacionId);
  }
  seleccionarCotizacion() {
    this.form.montoTotal = this.actual?.monto || 0;
    this.detalles = (this.actual?.detalles || []).map((x: any) => ({
      descripcion: x.descripcion,
      cantidad: Number(x.cantidad),
      precioUnitario: Number(x.precioUnitario),
      unidadMedida: x.unidadMedida || 'SERVICIO',
    }));
  }
  archivo(e: Event) {
    this.pdf = (e.target as HTMLInputElement).files?.item(0) || null;
  }
  guardar() {
    if (
      !this.form.cotizacionId ||
      !this.form.numero.trim() ||
      !this.form.fechaEmision ||
      !(this.form.montoTotal > 0)
    ) {
      this.error.set('Completa los campos obligatorios de la orden de compra.');
      return;
    }
    if (
      !this.pdf ||
      !(this.pdf.type === 'application/pdf' || this.pdf.name.toLowerCase().endsWith('.pdf')) ||
      this.pdf.size > 8 * 1024 * 1024
    ) {
      this.error.set('Adjunta un PDF válido de hasta 8 MB.');
      return;
    }
    const fd = new FormData();
    for (const k of ['cotizacionId', 'numero', 'fechaEmision', 'montoTotal'] as const)
      fd.append(k, String(this.form[k]));
    fd.append('pdf', this.pdf);
    fd.append('detallesJson', JSON.stringify(this.detalles));
    this.protegidoCargando(this.api.post('/ordenes-compra', fd), 'Orden registrada', '/compras');
  }
  descargar(c: any) {
    this.api.descargar('/ordenes-compra/' + c.id + '/pdf', c.nombrePdf || 'orden-compra.pdf');
  }
}
