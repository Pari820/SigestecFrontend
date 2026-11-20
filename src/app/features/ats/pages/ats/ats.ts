import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PaginaBase } from '../../../../shared/pages/pagina-base';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, AccionesSeguras],
  templateUrl: './ats.html',
  styleUrl: './ats.css',
})
export class AtsPage extends PaginaBase implements OnInit {
  ordenes = signal<any[]>([]);
  catalogoPeligros = [
    'Riesgo eléctrico',
    'Caída de altura',
    'Golpes o cortes',
    'Caída de objetos',
    'Exposición a ruido',
  ];
  catalogoEpp = [
    'Casco dieléctrico',
    'Guantes aislantes',
    'Lentes de seguridad',
    'Botas de seguridad',
    'Arnés de seguridad',
  ];
  form: any = {
    ordenTrabajoId: null,
    condicionesArea: '',
    peligros: [] as string[],
    epp: [] as string[],
    herramientas: '',
    etapas: [
      {
        etapa: '',
        peligro: '',
        riesgo: '',
        nivel: 'MEDIO',
        medidaControl: '',
      },
    ],
  };
  otro = '';
  pdf: File | null = null;
  ngOnInit() {
    this.cargarItems('/ats');
    this.api
      .get<any[]>('/ordenes-trabajo')
      .subscribe({
        next: (x) => this.ordenes.set(x),
        error: (e) => this.error.set(this.api.mensaje(e)),
      });
  }
  // Las etapas provienen de DETALLE_ANALISIS_RIESGO, no de JSON persistido en Oracle.
  get etapasDetalle(): {
    etapa: string;
    peligro: string;
    riesgo: string;
    nivel: string;
    medidaControl: string;
  }[] {
    const datos: unknown = this.registro?.etapas;
    return Array.isArray(datos) ? datos : [];
  }
  override textoBusqueda(x: any) {
    return `${x.id} ${x.ordenTrabajo?.id} ${x.ordenTrabajo?.solicitud?.cliente?.razonSocial} ${x.peligros || ''}`;
  }
  get elegibles() {
    return this.ordenes().filter(
      (o) => o.estado === 'PROGRAMADA' && !this.items().some((a) => a.ordenTrabajo.id === o.id),
    );
  }
  get actual() {
    return this.ordenes().find((o) => o.id === this.form.ordenTrabajoId);
  }
  archivo(e: Event) {
    this.pdf = (e.target as HTMLInputElement).files?.item(0) || null;
  }
  descargarPDF(a: any) {
    const file = String(a.urlArchivo || '')
      .split('/')
      .pop();
    if (file) this.api.descargar('/archivos/' + file, 'analisis-trabajo-seguro-' + a.id + '.pdf');
  }
  marcar(lista: 'peligros' | 'epp', valor: string, event: Event) {
    const s = new Set<string>(this.form[lista]);
    (event.target as HTMLInputElement).checked ? s.add(valor) : s.delete(valor);
    this.form[lista] = [...s];
  }
  agregarPeligro() {
    const v = this.otro.trim();
    if (v && !this.catalogoPeligros.includes(v)) this.catalogoPeligros.push(v);
    this.otro = '';
  }
  agregarEtapa() {
    this.form.etapas.push({
      etapa: '',
      peligro: '',
      riesgo: '',
      nivel: 'MEDIO',
      medidaControl: '',
    });
  }
  quitarEtapa(i: number) {
    if (this.form.etapas.length > 1) this.form.etapas.splice(i, 1);
  }
  guardar() {
    if (
      !this.form.ordenTrabajoId ||
      !this.form.condicionesArea.trim() ||
      !this.form.peligros.length ||
      !this.form.epp.length ||
      !this.form.etapas.length ||
      this.form.etapas.some(
        (e: any) =>
          !e.etapa.trim() || !e.peligro.trim() || !e.riesgo.trim() || !e.medidaControl.trim(),
      )
    ) {
      this.error.set('Completa la OT, inspección, peligros, EPP y todas las etapas del ATS.');
      return;
    }
    const fd = new FormData();
    fd.append('datos', new Blob([JSON.stringify(this.form)], { type: 'application/json' }));
    if (this.pdf) fd.append('pdf', this.pdf);
    this.protegidoCargando(this.api.post('/ats', fd), 'Análisis registrado', '/ats');
  }
}
