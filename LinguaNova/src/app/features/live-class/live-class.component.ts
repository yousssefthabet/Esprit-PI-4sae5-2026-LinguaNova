import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-class',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-16">
      <h1 class="text-4xl font-bold">Live Class</h1>
      <p class="text-gray-600 mt-4">Join your live class session.</p>
    </div>
  `
})
export class LiveClassComponent { }
