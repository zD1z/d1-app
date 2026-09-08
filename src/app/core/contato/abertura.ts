import { Injectable, InjectionToken, signal } from '@angular/core';
import { formularioEstaLigado } from '../config/contato';

export const FORMULARIO_LIGADO = new InjectionToken<boolean>('FORMULARIO_LIGADO', {
  providedIn: 'root',
  factory: () => formularioEstaLigado(),
});

@Injectable({ providedIn: 'root' })
export class AberturaDoFormulario {
  private readonly pedidos = signal(0);

  readonly pedido = this.pedidos.asReadonly();

  pedir(): void {
    this.pedidos.update((quantos) => quantos + 1);
  }
}
