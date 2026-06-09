import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitacaoRascunhoService } from '../../../core/services/solicitacao-rascunho.service';
import { CategoriaService } from '../../../core/services/categoria.service';
import { Categoria } from '../../../core/models/categoria.model';
import { BottomNavComponent } from '../../../shared/components/bottom-nav/bottom-nav';

@Component({
  selector: 'app-nova-solicitacao',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, BottomNavComponent],
  templateUrl: './nova-solicitacao.html',
  styleUrl: './nova-solicitacao.scss',
})
export class NovaSolicitacaoComponent implements OnInit {
  private readonly rascunho = inject(SolicitacaoRascunhoService);
  private readonly router = inject(Router);
  private readonly categoriaService = inject(CategoriaService);

  readonly categorias = signal<Categoria[]>([]);

  form = new FormGroup({
    categoria:       new FormControl('', Validators.required),
    descricao:       new FormControl('', [Validators.required, Validators.minLength(10)]),
    pontoReferencia: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    const atual = this.rascunho.rascunho();
    if (atual.categoria) this.form.patchValue(atual);

    this.categoriaService.listarAtivas().subscribe({
      next: cats => this.categorias.set(cats),
    });
  }

  voltar(): void {
    this.router.navigate(['/home']);
  }

  proxima(): void {
    if (this.form.invalid) return;
    this.rascunho.atualizar({
      categoria:       this.form.value.categoria!,
      descricao:       this.form.value.descricao!,
      pontoReferencia: this.form.value.pontoReferencia!,
    });
    this.router.navigate(['/solicitacao/nova/localizacao']);
  }
}
