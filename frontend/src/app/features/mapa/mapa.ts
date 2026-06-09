import { Component, afterNextRender, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SolicitacaoLocalService, SolicitacaoLocal } from '../../core/services/solicitacao-local.service';
import { AuthService } from '../../core/services/auth.service';
import { COR_PRIORIDADE, FILTRO_SEM_DADOS, FILTROS_MAPA, PRIORIDADE_LABEL } from '../../core/constants/solicitacao.constants';
import { adicionarTileLayer, pinSvg } from '../../core/utils/leaflet.utils';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [RouterLink, BottomNavComponent],
  templateUrl: './mapa.html',
  styleUrl: './mapa.scss',
})
export class MapaComponent {
  private readonly service = inject(SolicitacaoLocalService);
  private readonly auth = inject(AuthService);

  readonly FILTROS         = FILTROS_MAPA;
  readonly FILTRO_SEM_DADOS = FILTRO_SEM_DADOS;
  readonly selecionada  = signal<SolicitacaoLocal | null>(null);
  readonly filtroAtivo  = signal<string | null>(null);
  readonly isAdmin      = signal(false);
  readonly filtroAberto = signal(false);

  private mapaLeaflet: import('leaflet').Map | null = null;
  private marcadores: Array<{ marker: import('leaflet').Marker; prioridade: string | null }> = [];

  constructor() {
    this.isAdmin.set(this.auth.isAdmin());
    afterNextRender(() => this.iniciarMapa());
  }

  private async iniciarMapa(): Promise<void> {
    const L = await import('leaflet');
    const lista = this.service.listar().filter(s =>
      s.lat && s.lng && (this.isAdmin() || this.ehValidada(s))
    );

    this.mapaLeaflet = L.map('mapa-container', { zoomControl: true }).setView([-23.4205, -51.9331], 13);

    adicionarTileLayer(L, this.mapaLeaflet);

    for (const sol of lista) {
      const cor = sol.prioridade ? COR_PRIORIDADE[sol.prioridade] : '#9ca3af';
      const icone = L.divIcon({
        className: '',
        html: pinSvg(cor),
        iconSize: [28, 36],
        iconAnchor: [14, 36],
      });
      const marker = L.marker([sol.lat, sol.lng], { icon: icone })
        .addTo(this.mapaLeaflet)
        .on('click', () => this.selecionada.set(sol));
      this.marcadores.push({ marker, prioridade: sol.prioridade });
    }
  }

  toggleFiltro(): void {
    this.filtroAberto.set(!this.filtroAberto());
  }

  filtrar(prioridade: string | null): void {
    const novo = this.filtroAtivo() === prioridade ? null : prioridade;
    this.filtroAtivo.set(novo);
    this.filtroAberto.set(false);
    if (!this.mapaLeaflet) return;
    for (const m of this.marcadores) {
      const visivel = novo === null
        || (novo === FILTRO_SEM_DADOS.prioridade ? m.prioridade === null : m.prioridade === novo);
      if (visivel) m.marker.addTo(this.mapaLeaflet);
      else m.marker.remove();
    }
  }

  fechar(): void { this.selecionada.set(null); }

  tempoInfo(sol: SolicitacaoLocal): string {
    const inicio = new Date(sol.dataAbertura).getTime();
    const fim = sol.dataAtualizacao ? new Date(sol.dataAtualizacao).getTime() : Date.now();
    const dias = Math.floor((fim - inicio) / 86400000);
    if (sol.status === 'RESOLVIDO' || sol.status === 'ENCERRADO') {
      if (dias === 0) return 'Resolvido hoje';
      if (dias === 1) return 'Resolvido em 1 dia';
      return `Resolvido em ${dias} dias`;
    }
    if (dias === 0) return 'Aberta hoje';
    if (dias === 1) return 'Aberta há 1 dia';
    return `Aberta há ${dias} dias`;
  }

  prioridadeLabel(p: string | null): string {
    return p ? (PRIORIDADE_LABEL[p] ?? p) : '—';
  }

  prioridadeCor(p: string | null): string {
    return p ? (COR_PRIORIDADE[p] ?? '#9ca3af') : '#9ca3af';
  }

  ehValidada(sol: SolicitacaoLocal): boolean {
    return sol.prioridade !== null && sol.departamento !== null;
  }
}
