import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div class="flex w-full max-w-[1400px] bg-white rounded-2xl shadow-lg overflow-hidden h-[850px]">
        
        <!-- Left Side: Hero (35%) -->
        <div class="hidden lg:flex lg:w-[35%] relative bg-teal-500 overflow-hidden h-full">
           <!-- Image -->
           <img 
             src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop" 
             alt="Classroom students"
             class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
           >
           <!-- Gradient Overlay -->
           <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
           
           <!-- Text Content -->
           <div class="absolute bottom-12 left-8 text-white z-10 max-w-sm">
              <h1 class="text-4xl font-bold mb-2 leading-tight drop-shadow-lg">Have a good journey</h1>
              <p class="text-lg font-light opacity-90 drop-shadow-md">in Jungle English</p>
           </div>
        </div>

        <!-- Right Side: Form (65%) -->
        <div class="w-full lg:w-[65%] p-12 lg:p-16 flex flex-col relative bg-white overflow-y-auto">
           
           <!-- Header -->
           <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Welcome to lorem_!</h2>
           </div>

           <!-- Navigation Toggles -->
           <div class="flex justify-center mb-8">
             <div class="inline-flex bg-gray-100 p-1 rounded-full">
                <button 
                  (click)="navigateTo('/auth/login')"
                  [class]="mode === 'login' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
                  class="px-8 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none min-w-[120px]"
                >
                  Login
                </button>
                <button 
                  (click)="navigateTo('/auth/register')"
                  [class]="mode === 'register' ? 'bg-[#5FCFC5] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'"
                  class="px-8 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none min-w-[120px]"
                >
                  Register
                </button>
             </div>
           </div>
           
           <!-- Projected Content -->
           <div class="w-full">
             <ng-content></ng-content>
           </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AuthLayoutComponent {
  @Input() mode: 'login' | 'register' = 'login';
  private router = inject(Router);

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
