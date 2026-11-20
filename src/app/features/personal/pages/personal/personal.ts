import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../../core/services/api.service';
import { AccionesSeguras } from '../../../../shared/components/acciones-seguras/acciones-seguras';

@Component({
  standalone: true,
  imports: [FormsModule, AccionesSeguras],
  templateUrl: './personal.html',
  styleUrl: './personal.css',
})
export class PersonalCatalogo implements OnInit {
  api = inject(ApiService);
  items: any[] = [];
  form = { nombre: '', perfil: 'TECNICO' };
  error = '';
  ok = '';
  ngOnInit() {
    this.cargar();
  }
  cargar() {
    this.api
      .get<any[]>('/personal')
      .subscribe({
        next: (r) => (this.items = r),
        error: (e) => (this.error = this.api.mensaje(e)),
      });
  }
  guardar() {
    this.error = '';
    this.ok = '';
    this.api.post('/personal', this.form).subscribe({
      next: () => {
        this.ok = 'Personal registrado';
        this.form = { nombre: '', perfil: 'TECNICO' };
        this.cargar();
      },
      error: (e) => (this.error = this.api.mensaje(e)),
    });
  }
}
