import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, AccionesSeguras],
  templateUrl: './catalogos.html',
  styleUrl: './catalogos.css',
})
export class Catalogos implements OnInit {
  api = inject(ApiService);
  route = inject(ActivatedRoute);
  get esClientes() {
    return this.route.snapshot.data['tipo'] === 'clientes';
  }
  get ruta() {
    return this.esClientes ? '/clientes' : '/tipos-servicio';
  }
  items: any[] = [];
  form: any = {};
  error = '';
  ok = '';
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.api
      .get<any[]>(this.ruta)
      .subscribe({
        next: (x) => (this.items = x),
        error: (e) => (this.error = this.api.mensaje(e)),
      });
  }
  guardar() {
    this.error = '';
    this.ok = '';
    this.api.post(this.ruta, this.form).subscribe({
      next: () => {
        this.ok = 'Registro guardado';
        this.form = {};
        this.cargar();
      },
      error: (e) => (this.error = this.api.mensaje(e)),
    });
  }
}
