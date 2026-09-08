import { DOCUMENT, DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router, type ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs';

export const SITE = 'https://d1.app.br';

export interface DadosDeMeta {
  readonly descricao: string;
}

export function enderecoCanonico(url: string, site = SITE): string {
  const caminho = url.split(/[?#]/)[0];

  if (caminho === '/' || caminho === '') {
    return `${site}/`;
  }

  return `${site}${caminho.replace(/\/$/, '')}`;
}

@Injectable({ providedIn: 'root' })
export class MetaDaRota {
  private readonly router = inject(Router);
  private readonly meta = inject(Meta);
  private readonly titulo = inject(Title);
  private readonly documento = inject(DOCUMENT);
  private readonly aoDestruir = inject(DestroyRef);

  observar(): void {
    this.router.events
      .pipe(
        filter((evento): evento is NavigationEnd => evento instanceof NavigationEnd),
        takeUntilDestroyed(this.aoDestruir),
      )
      .subscribe((evento) => this.aplicar(evento.urlAfterRedirects));
  }

  private aplicar(url: string): void {
    const rota = this.folhaDaRota();
    const dados = rota.data as Partial<DadosDeMeta>;
    const descricao = dados.descricao ?? '';

    const titulo = rota.title ?? this.titulo.getTitle();
    const canonico = enderecoCanonico(url);

    if (descricao !== '') {
      this.meta.updateTag({ name: 'description', content: descricao });
      this.meta.updateTag({ property: 'og:description', content: descricao });
    }

    this.meta.updateTag({ property: 'og:title', content: titulo });
    this.meta.updateTag({ property: 'og:url', content: canonico });
    this.definirCanonico(canonico);
  }

  private definirCanonico(endereco: string): void {
    const existente = this.documento.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (existente) {
      existente.href = endereco;
      return;
    }

    const etiqueta = this.documento.createElement('link');
    etiqueta.rel = 'canonical';
    etiqueta.href = endereco;
    this.documento.head.appendChild(etiqueta);
  }

  private folhaDaRota(): ActivatedRouteSnapshot {
    let rota = this.router.routerState.snapshot.root;

    while (rota.firstChild) {
      rota = rota.firstChild;
    }

    return rota;
  }
}
