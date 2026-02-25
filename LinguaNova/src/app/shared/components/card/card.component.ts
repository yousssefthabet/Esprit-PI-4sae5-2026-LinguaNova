import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div [class]="cardClasses">
      @if (hasHeader) {
        <div class="card-header p-6 pb-4">
          <ng-content select="[header]"></ng-content>
        </div>
      }
      
      <div [class]="contentClasses">
        <ng-content></ng-content>
      </div>
      
      @if (hasFooter) {
        <div class="card-footer p-6 pt-4 border-t border-border">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `,
    styles: []
})
export class CardComponent {
    @Input() hover = false;
    @Input() noPadding = false;
    @Input() hasHeader = false;
    @Input() hasFooter = false;

    get cardClasses(): string {
        const baseClasses = 'bg-card rounded-card border border-border overflow-hidden';
        const hoverClasses = this.hover ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer' : 'shadow-card';

        return `${baseClasses} ${hoverClasses}`;
    }

    get contentClasses(): string {
        return this.noPadding ? '' : 'p-6';
    }
}
