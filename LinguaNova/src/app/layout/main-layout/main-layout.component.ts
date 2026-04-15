import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      @if (showFooter) {
        <app-footer />
      }
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  private router = inject(Router);

  get showFooter(): boolean {
    const url = this.router.url;
    return !url.includes('/auth/login') && !url.includes('/auth/register');
  }
}
