import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LogService } from '../../core/services/log.service';
import { LogAcao } from '../../core/models/log.model';
import { BottomNavComponent } from '../../shared/components/bottom-nav/bottom-nav';

const PAGE_SIZE = 10;

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [RouterLink, BottomNavComponent],
  templateUrl: './log.html',
  styleUrl: './log.scss',
})
export class LogComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly logService = inject(LogService);

  readonly logs = signal<LogAcao[]>([]);
  readonly termoBusca = signal('');
  readonly paginaCorrente = signal(1);

  readonly filtrados = computed(() => {
    const t = this.termoBusca().toLowerCase();
    if (!t) return this.logs();
    return this.logs().filter(l =>
      l.acao.toLowerCase().includes(t) ||
      (l.entidade ?? '').toLowerCase().includes(t) ||
      (l.usuarioNome ?? '').toLowerCase().includes(t) ||
      (l.detalhes ?? '').toLowerCase().includes(t)
    );
  });

  readonly totalPaginas = computed(() => Math.max(1, Math.ceil(this.filtrados().length / PAGE_SIZE)));
  readonly paginas = computed(() => Array.from({ length: this.totalPaginas() }, (_, i) => i + 1));
  readonly paginaItens = computed(() => {
    const inicio = (this.paginaCorrente() - 1) * PAGE_SIZE;
    return this.filtrados().slice(inicio, inicio + PAGE_SIZE);
  });

  ngOnInit(): void {
    if (!this.auth.isGestor()) {
      this.router.navigate(['/home']);
      return;
    }
    this.logService.listar().subscribe({ next: lista => this.logs.set(lista) });
  }

  onBusca(event: Event): void {
    this.termoBusca.set((event.target as HTMLInputElement).value);
    this.paginaCorrente.set(1);
  }

  irPara(p: number): void { this.paginaCorrente.set(p); }
  paginaAnterior(): void { if (this.paginaCorrente() > 1) this.paginaCorrente.update(p => p - 1); }
  proximaPagina(): void { if (this.paginaCorrente() < this.totalPaginas()) this.paginaCorrente.update(p => p + 1); }

  formatarData(iso: string | null): string {
    if (!iso) return '—';
    const d = new Date(iso);
    const p = (n: number) => n.toString().padStart(2, '0');
    return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
  }
}
