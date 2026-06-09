import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <header>
        <span>ReportaInga</span>
        <button (click)="logout()">Sair</button>
      </header>
      <main>
        <h1>Bem-vindo, {{ user()?.nome }}</h1>
        <p>Perfil: {{ user()?.perfil }}</p>
      </main>
    </div>
  `,
  styles: [`
    .dashboard { font-family: sans-serif; }
    header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 2rem; background: #1a6b3c; color: white; }
    main { padding: 2rem; }
    button { background: transparent; border: 1px solid white; color: white; padding: 0.375rem 0.75rem; border-radius: 4px; cursor: pointer; }
  `]
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = signal<AuthResponse | null>(null);

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser());
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
