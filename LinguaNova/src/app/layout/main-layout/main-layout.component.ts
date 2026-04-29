import { Component, HostListener, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { AccessibilityPanelComponent } from '../../shared/components/accessibility-panel/accessibility-panel.component';
import { AccessibilityStateService } from '../../core/services/accessibility-state.service';
import { AccessibilityHoverSpeechService } from '../../core/services/accessibility-hover-speech.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, AccessibilityPanelComponent],
  template: `
    <div class="flex flex-col min-h-screen" [class.accessible-mode]="accessibilityState.enabled()">
      <app-navbar />
      <main class="flex-1">
        <router-outlet />
      </main>
      @if (showFooter) {
        <app-footer />
      }
      <app-accessibility-panel />
    </div>
  `,
  styles: []
})
export class MainLayoutComponent {
  private router = inject(Router);
  private readonly hoverSpeech = inject(AccessibilityHoverSpeechService);
  protected readonly accessibilityState = inject(AccessibilityStateService);

  constructor() {
    effect(() => {
      if (!this.accessibilityState.enabled()) {
        this.hoverSpeech.stop();
      }
    });
  }

  @HostListener('document:mouseover', ['$event'])
  onDocumentMouseOver(event: MouseEvent): void {
    if (!this.accessibilityState.enabled()) {
      return;
    }
    this.hoverSpeech.handleMouseOver(event);
  }

  @HostListener('document:focusin', ['$event'])
  onDocumentFocusIn(event: FocusEvent): void {
    if (!this.accessibilityState.enabled()) {
      return;
    }
    this.hoverSpeech.handleFocusIn(event);
  }

  get showFooter(): boolean {
    const url = this.router.url;
    return !url.includes('/auth/login') && !url.includes('/auth/register');
  }
}
