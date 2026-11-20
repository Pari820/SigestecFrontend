import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginaBase } from '../../../../shared/pages/pagina-base';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AccionesSeguras],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes extends PaginaBase implements OnInit {
  clientes = signal<any[]>([]);
  tipos = signal<any[]>([]);
  filtroCliente = '';
  pdf: File | null = null;
  form = {
    clienteId: null as number | null,
    tipoServicioId: null as number | null,
    descripcion: '',
    observaciones: '',
  };
  ngOnInit() {
    this.cargarItems('/solicitudes');
    this.api
      .get<any[]>('/clientes')
      .subscribe({
        next: (x) => this.clientes.set(x),
        error: (e) => this.error.set(this.api.mensaje(e)),
      });
    this.api
      .get<any[]>('/tipos-servicio')
      .subscribe({
        next: (x) => this.tipos.set(x),
        error: (e) => this.error.set(this.api.mensaje(e)),
      });
  }
  override textoBusqueda(x: any) {
    return `${x.id} ${x.cliente?.razonSocial || ''} ${x.tipoServicio?.nombre || ''} ${x.descripcion || ''}`;
  }
  get clientesFiltrados() {
    const b = this.filtroCliente.toLocaleLowerCase('es');
    return this.clientes().filter((c) => c.estado !== 'I').filter((c) =>
      `${c.razonSocial} ${c.ruc}`.toLocaleLowerCase('es').includes(b),
    );
  }
  get tiposActivos() {
    return this.tipos().filter((t) => t.estado !== 'I');
  }
  get fechaHoy() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  }
  codigo(i: any) {
    return `SOL-${String(i.fechaRecepcion || '').slice(0, 4) || new Date().getFullYear()}-${String(i.id).padStart(3, '0')}`;
  }
  archivo(e: Event) {
    this.pdf = (e.target as HTMLInputElement).files?.item(0) || null;
  }
  guardar() {
    if (!this.form.clienteId || !this.form.tipoServicioId || !this.form.descripcion.trim()) {
      this.error.set('Completa el cliente, tipo de servicio y descripción del trabajo.');
      return;
    }
    const fd = new FormData();
    fd.append('datos', new Blob([JSON.stringify(this.form)], { type: 'application/json' }));
    if (this.pdf) fd.append('pdf', this.pdf);
    this.protegidoCargando(
      this.api.post('/solicitudes', fd),
      'Solicitud registrada',
      '/solicitudes',
    );
  }
}
