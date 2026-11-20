import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginaBase } from '../../../../shared/pages/pagina-base';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AccionesSeguras],
  templateUrl: './informes.html',
  styleUrl: './informes.css',
})
export class Informes extends PaginaBase implements OnInit {
  ejecuciones = signal<any[]>([]);
  form = {
    ordenTrabajoId: null as number | null,
    numeroInforme: '',
    diagnostico: '',
    trabajosRealizados: '',
    conclusiones: '',
    recomendaciones: '',
    fechaEnvio: '',
  };
  pdf: File | null = null;
  fotos: File[] = [];
  ngOnInit() {
    this.cargarItems('/informes');
    this.api
      .get<any[]>('/ejecuciones')
      .subscribe({
        next: (x) => this.ejecuciones.set(x),
        error: (e) => this.error.set(this.api.mensaje(e)),
      });
  }
  override textoBusqueda(x: any) {
    return `${x.numeroInforme} ${x.ordenTrabajo?.id} ${x.ordenTrabajo?.solicitud?.cliente?.razonSocial} ${x.conclusiones}`;
  }
  get elegibles() {
    return this.ejecuciones().filter(
      (e) => !this.items().some((i) => i.ordenTrabajo.id === e.ordenTrabajo?.id),
    );
  }
  get actual() {
    return this.ejecuciones().find((e) => e.ordenTrabajo?.id === this.form.ordenTrabajoId);
  }
  archivo(e: Event) {
    this.pdf = (e.target as HTMLInputElement).files?.item(0) || null;
  }
  fotosSeleccionadas(e: Event) {
    this.fotos = Array.from((e.target as HTMLInputElement).files || []);
  }
  descargar(url: string, nombre: string) {
    if (url) this.api.descargar('/archivos/' + url.split('/').pop(), nombre);
  }
  guardar() {
    this.error.set('');
    if (
      !this.form.ordenTrabajoId ||
      !this.form.diagnostico.trim() ||
      !this.form.trabajosRealizados.trim() ||
      !this.form.conclusiones.trim() ||
      !this.form.fechaEnvio
    ) {
      this.error.set(
        'Selecciona la OT ejecutada y completa diagnóstico, trabajos, conclusiones y fecha de envío.',
      );
      return;
    }
    const fd = new FormData();
    fd.append('datos', new Blob([JSON.stringify(this.form)], { type: 'application/json' }));
    if (this.pdf) fd.append('pdf', this.pdf);
    for (const foto of this.fotos) fd.append('fotos', foto);
    this.protegidoCargando(this.api.post('/informes', fd), 'Informe registrado', '/informes');
  }
}
