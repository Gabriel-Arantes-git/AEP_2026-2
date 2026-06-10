import { Component, HostListener, OnInit, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SolicitacaoLocalService, SolicitacaoLocal } from '../../../core/services/solicitacao-local.service';
import { FILTRO_USUARIO, PRIORIDADES, STATUS_FLUXO, STATUS_OPCOES } from '../../../core/constants/solicitacao.constants';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { DepartamentoService } from '../../../core/services/departamento.service';
import { DepartamentoDestino } from '../../../core/models/departamento.model';
import { GeocodingService } from '../../../core/services/geocoding.service';
import { adicionarTileLayer, marcadorSvg } from '../../../core/utils/leaflet.utils';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav';

const PAGE_SIZE_MOBILE = 4;
const BP_MD = 768;
const BP_XL = 1280;

@Component({
  selector: 'app-listagem',
  standalone: true,
  imports: [RouterLink, BottomNavComponent],
  templateUrl: './listagem.html',
  styleUrl: './listagem.scss',
})
export class ListagemComponent implements OnInit {
  private readonly service = inject(SolicitacaoLocalService);
  private readonly auth = inject(AuthService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly departamentoService = inject(DepartamentoService);
  private readonly geocoding = inject(GeocodingService);
  private readonly platformId = inject(PLATFORM_ID);

  readonly STATUS_OPCOES = STATUS_OPCOES;
  readonly PRIORIDADES = PRIORIDADES;
  readonly categorias = signal<Categoria[]>([]);
  readonly departamentos = signal<DepartamentoDestino[]>([]);

  readonly isAdmin = signal(false);
  readonly filtroOpcoes = computed(() => this.isAdmin() ? STATUS_OPCOES : FILTRO_USUARIO);
  readonly solicitacoes = signal<SolicitacaoLocal[]>([]);
  readonly termoBusca = signal('');
  readonly filtroStatus = signal<string | null>(null);
  readonly filtrosAberto = signal(false);
  readonly paginaCorrente = signal(1);
  readonly modalAberta = signal<SolicitacaoLocal | null>(null);
  readonly modalEditar = signal<SolicitacaoLocal | null>(null);
  readonly mostrarMapaEdicao = signal(false);
  readonly carregandoEnderecoEdicao = signal(false);
  readonly larguraJanela = signal(0);

  readonly pageSize = computed(() => {
    const w = this.larguraJanela();
    if (w >= BP_XL) return PAGE_SIZE_MOBILE * 3;
    if (w >= BP_MD) return PAGE_SIZE_MOBILE * 2;
    return PAGE_SIZE_MOBILE;
  });

  private editMap: import('leaflet').Map | null = null;
  private editMarcador: import('leaflet').Marker | null = null;

  editForm: {
    categoria: string;
    descricao: string;
    pontoReferencia: string;
    status: SolicitacaoLocal['status'];
    prioridade: SolicitacaoLocal['prioridade'];
    departamento: string;
    lat: number;
    lng: number;
    cep: string;
    bairro: string;
    logradouro: string;
  } = {
    categoria: '',
    descricao: '',
    pontoReferencia: '',
    status: 'ABERTO',
    prioridade: null,
    departamento: '',
    lat: 0,
    lng: 0,
    cep: '',
    bairro: '',
    logradouro: '',
  };

  readonly filtradas = computed(() => {
    const t = this.termoBusca().toLowerCase();
    const s = this.filtroStatus();
    return this.solicitacoes().filter(x => {
      const matchTermo = !t ||
        x.categoria.toLowerCase().includes(t) ||
        x.protocolo.toLowerCase().includes(t) ||
        x.descricao.toLowerCase().includes(t);
      const matchStatus = s === 'EM_ANALISE'
        ? !this.ehValidada(x)
        : !s || x.status === s;
      return matchTermo && matchStatus;
    });
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtradas().length / this.pageSize())));
  readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));
  readonly paginaItens = computed(() => {
    const tamanho = this.pageSize();
    const inicio = (this.paginaCorrente() - 1) * tamanho;
    return this.filtradas().slice(inicio, inicio + tamanho);
  });

  ngOnInit(): void {
    this.isAdmin.set(this.auth.isAdmin());
    this.solicitacoes.set(this.service.listar());
    this.categoriaService.listarAtivas().subscribe({ next: cats => this.categorias.set(cats) });
    this.departamentoService.listarAtivos().subscribe({ next: deps => this.departamentos.set(deps) });
    if (isPlatformBrowser(this.platformId)) {
      this.larguraJanela.set(window.innerWidth);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.larguraJanela.set(window.innerWidth);
    if (this.paginaCorrente() > this.totalPaginas()) {
      this.paginaCorrente.set(this.totalPaginas());
    }
  }

  onBusca(event: Event): void {
    this.termoBusca.set((event.target as HTMLInputElement).value);
    this.paginaCorrente.set(1);
  }

  toggleFiltros(): void { this.filtrosAberto.update(v => !v); }

  setFiltro(status: string | null): void {
    this.filtroStatus.set(this.filtroStatus() === status ? null : status);
    this.paginaCorrente.set(1);
  }

  irPara(p: number): void { this.paginaCorrente.set(p); }
  paginaAnterior(): void { if (this.paginaCorrente() > 1) this.paginaCorrente.update(p => p - 1); }
  proximaPagina(): void { if (this.paginaCorrente() < this.totalPaginas()) this.paginaCorrente.update(p => p + 1); }

  abrirModal(sol: SolicitacaoLocal): void { this.modalAberta.set(sol); }
  fecharModal(): void { this.modalAberta.set(null); }

  abrirEditar(sol: SolicitacaoLocal): void {
    this.editForm = {
      categoria: sol.categoria,
      descricao: sol.descricao,
      pontoReferencia: sol.pontoReferencia,
      status: sol.status,
      prioridade: sol.prioridade,
      departamento: sol.departamento ?? '',
      lat: sol.lat,
      lng: sol.lng,
      cep: sol.cep,
      bairro: sol.bairro,
      logradouro: sol.logradouro,
    };
    this.destroyEditMap();
    this.mostrarMapaEdicao.set(false);
    this.modalEditar.set(sol);
  }

  fecharEditar(): void {
    this.destroyEditMap();
    this.mostrarMapaEdicao.set(false);
    this.modalEditar.set(null);
  }

  salvarEdicao(): void {
    const sol = this.modalEditar();
    if (!sol) return;
    this.service.atualizar(sol.id, {
      categoria: this.editForm.categoria,
      descricao: this.editForm.descricao,
      pontoReferencia: this.editForm.pontoReferencia,
      status: this.editForm.status,
      prioridade: this.editForm.prioridade,
      departamento: this.editForm.departamento || null,
      lat: this.editForm.lat,
      lng: this.editForm.lng,
      cep: this.editForm.cep,
      bairro: this.editForm.bairro,
      logradouro: this.editForm.logradouro,
      dataAtualizacao: new Date().toISOString(),
    });
    this.solicitacoes.set(this.service.listar());
    this.fecharEditar();
  }

  async toggleMapaEdicao(): Promise<void> {
    if (this.mostrarMapaEdicao()) {
      this.destroyEditMap();
      this.mostrarMapaEdicao.set(false);
      return;
    }
    this.mostrarMapaEdicao.set(true);
    await new Promise<void>(r => setTimeout(r, 80));
    this.initEditMap();
  }

  private async initEditMap(): Promise<void> {
    const container = document.getElementById('edit-map-container');
    if (!container || this.editMap) return;

    const L = await import('leaflet');
    const icone = L.divIcon({
      className: '',
      html: marcadorSvg(),
      iconSize: [32, 42],
      iconAnchor: [16, 42],
    });

    const lat = this.editForm.lat || -23.4205;
    const lng = this.editForm.lng || -51.9331;

    this.editMap = L.map(container).setView([lat, lng], 15);
    adicionarTileLayer(L, this.editMap);

    if (this.editForm.lat && this.editForm.lng) {
      this.editMarcador = L.marker([lat, lng], { icon: icone }).addTo(this.editMap);
    }

    this.editMap.on('click', (e: import('leaflet').LeafletMouseEvent) => {
      this.aoClicarMapaEdicao(L, icone, e.latlng.lat, e.latlng.lng);
    });
  }

  private destroyEditMap(): void {
    if (this.editMap) {
      this.editMap.remove();
      this.editMap = null;
      this.editMarcador = null;
    }
  }

  private aoClicarMapaEdicao(
    L: typeof import('leaflet'),
    icone: import('leaflet').DivIcon,
    lat: number,
    lng: number,
  ): void {
    this.editForm.lat = lat;
    this.editForm.lng = lng;
    if (this.editMarcador) this.editMap!.removeLayer(this.editMarcador);
    this.editMarcador = L.marker([lat, lng], { icon: icone }).addTo(this.editMap!);
    this.carregandoEnderecoEdicao.set(true);
    this.geocoding.reverter(lat, lng).subscribe({
      next: (res) => {
        this.editForm.logradouro = res.logradouro;
        this.editForm.bairro = res.bairro;
        this.editForm.cep = res.cep;
        this.carregandoEnderecoEdicao.set(false);
      },
      error: () => this.carregandoEnderecoEdicao.set(false),
    });
  }

  ehValidada(sol: SolicitacaoLocal): boolean {
    return sol.prioridade !== null && sol.departamento !== null;
  }

  statusLabel(status: string): string {
    return STATUS_OPCOES.find(s => s.valor === status)?.label ?? status;
  }

  prioridadeLabel(p: string | null): string {
    return PRIORIDADES.find(x => x.valor === p)?.label ?? '—';
  }

  statusIndice(status: string): number {
    return (STATUS_FLUXO as string[]).indexOf(status);
  }

  formatarData(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    const p = (n: number) => n.toString().padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  onSelectChange(field: 'status' | 'categoria' | 'departamento', event: Event): void {
    this.editForm[field] = (event.target as HTMLSelectElement).value as never;
  }

  onPrioridadeChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.editForm.prioridade = (val || null) as SolicitacaoLocal['prioridade'];
  }

  onTextInput(field: string, event: Event): void {
    (this.editForm as Record<string, unknown>)[field] = (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }
}
