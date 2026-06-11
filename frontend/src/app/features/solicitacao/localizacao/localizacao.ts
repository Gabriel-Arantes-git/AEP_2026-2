import { Component, ElementRef, ViewChild, afterNextRender, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SolicitacaoRascunhoService } from '../../../core/services/solicitacao-rascunho.service';
import { SolicitacaoService } from '../../../core/services/solicitacao.service';
import { AuthService } from '../../../core/services/auth.service';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { adicionarTileLayer, marcadorSvg } from '../../../core/utils/leaflet.utils';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-localizacao',
  standalone: true,
  imports: [RouterLink, BottomNavComponent],
  templateUrl: './localizacao.html',
  styleUrl: './localizacao.scss',
})
export class LocalizacaoComponent {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private readonly router             = inject(Router);
  private readonly rascunho           = inject(SolicitacaoRascunhoService);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly auth               = inject(AuthService);
  private readonly geocoding          = inject(GeocodingService);

  readonly pontoSelecionado   = signal(false);
  readonly carregandoEndereco = signal(false);
  readonly logradouro         = signal('');
  readonly bairro             = signal('');
  readonly cep                = signal('');
  readonly enviando           = signal(false);
  readonly erro               = signal('');

  private map:      import('leaflet').Map    | null = null;
  private marcador: import('leaflet').Marker | null = null;
  private lat = 0;
  private lng = 0;

  constructor() {
    afterNextRender(() => this.iniciarMapa());
  }

  private async iniciarMapa(): Promise<void> {
    const L = await import('leaflet');

    const icone = L.divIcon({
      className: '',
      html: marcadorSvg(),
      iconSize: [32, 42],
      iconAnchor: [16, 42],
    });

    this.map = L.map(this.mapContainer.nativeElement, { zoomControl: true })
      .setView([-23.4205, -51.9331], 14);

    adicionarTileLayer(L, this.map);

    this.map.on('click', (e: import('leaflet').LeafletMouseEvent) => {
      this.aoClicarMapa(L, icone, e.latlng.lat, e.latlng.lng);
    });
  }

  private aoClicarMapa(
    L: typeof import('leaflet'),
    icone: import('leaflet').DivIcon,
    lat: number,
    lng: number,
  ): void {
    this.lat = lat;
    this.lng = lng;

    if (this.marcador) this.map!.removeLayer(this.marcador);
    this.marcador = L.marker([lat, lng], { icon: icone }).addTo(this.map!);

    this.pontoSelecionado.set(true);
    this.carregandoEndereco.set(true);
    this.logradouro.set('');
    this.bairro.set('');
    this.cep.set('');

    this.geocoding.reverter(lat, lng).subscribe({
      next: (res) => {
        this.logradouro.set(res.logradouro);
        this.bairro.set(res.bairro);
        this.cep.set(res.cep);
        this.carregandoEndereco.set(false);
      },
      error: () => this.carregandoEndereco.set(false),
    });
  }

  confirmar(): void {
    const r = this.rascunho.rascunho();
    const anonimo = !this.auth.isAuthenticated();
    const req = {
      categoriaId: r.categoriaId,
      descricao:   r.descricao,
      bairro:      this.bairro(),
      logradouro:  this.logradouro(),
      referencia:  r.pontoReferencia,
      anonimo,
      latitude:    this.lat,
      longitude:   this.lng,
      cep:         this.cep(),
    };

    this.enviando.set(true);
    this.erro.set('');
    const obs = anonimo ? this.solicitacaoService.criarAnonima(req) : this.solicitacaoService.criar(req);
    obs.subscribe({
      next: () => {
        this.rascunho.limpar();
        this.router.navigate(['/acompanhamento']);
      },
      error: err => {
        this.enviando.set(false);
        this.erro.set(err.error?.mensagem ?? 'Erro ao enviar denúncia. Tente novamente.');
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/solicitacao/nova']);
  }
}
