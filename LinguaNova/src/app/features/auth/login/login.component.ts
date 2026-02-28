import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';
import { AuthLayoutComponent } from '../layout/auth-layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  template: `
    <app-auth-layout mode="login">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- User Name (Email) -->
        <div class="space-y-2">
          <label for="email" class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">User Name</label>
          <div class="relative">
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              placeholder="you@example.com"
              class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 font-medium"
              [class.border-red-500]="isFieldInvalid('email')"
            />
          </div>
          @if (isFieldInvalid('email')) {
            <p class="text-xs text-red-500 pl-1 mt-1 font-medium">{{ getErrorMessage('email') }}</p>
          }
        </div>

        <!-- Password -->
        <div class="space-y-2">
          <label for="password" class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Password</label>
          <div class="relative">
            <input 
              id="password" 
              [type]="showPassword ? 'text' : 'password'" 
              formControlName="password"
              placeholder="•••••••••"
              class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all pr-12 text-gray-800 tracking-widest"
              [class.border-red-500]="isFieldInvalid('password')"
            />
            <button 
              type="button"
              (click)="togglePasswordVisibility()"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5FCFC5] transition-colors focus:outline-none"
            >
              <span class="text-xs font-semibold uppercase tracking-wider">{{ showPassword ? 'Hide' : 'Show' }}</span>
            </button>
          </div>
          @if (isFieldInvalid('password')) {
            <p class="text-xs text-red-500 pl-1 mt-1 font-medium">{{ getErrorMessage('password') }}</p>
          }
        </div>

        <!-- Options -->
        <div class="flex items-center justify-between pl-1">
          <label class="flex items-center cursor-pointer group">
            <div class="relative flex items-center">
              <input 
                type="checkbox" 
                formControlName="rememberMe"
                class="peer h-4 w-4 rounded border-gray-300 text-[#5FCFC5] focus:ring-[#5FCFC5]"
              />
            </div>
            <span class="ml-2 text-sm text-gray-500 group-hover:text-gray-700 transition-colors font-medium">Remember me</span>
          </label>
          <a href="#" class="text-sm text-[#5FCFC5] hover:text-[#4bc2b8] transition-colors font-semibold tracking-wide">
            Forgot Password?
          </a>
        </div>

        <!-- Error Message -->
        @if (errorMessage) {
          <div class="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
          </div>
        }

        <!-- Submit Button -->
        <button 
          type="submit" 
          [disabled]="loginForm.invalid || loading"
          class="w-full py-4 mt-4 bg-[#5FCFC5] hover:bg-[#4bc2b8] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#5FCFC5]/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-lg tracking-wide flex items-center justify-center gap-2"
        >
          @if (loading) {
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Signing in...</span>
          } @else {
            <span>Login</span>
          }
        </button>
      </form>
    </app-auth-layout>
  `,
  styles: []
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.touched && control?.errors);
  }

  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${field === 'email' ? 'User name' : 'Password'} is required`;
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `Password must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Clean up the email value if needed
      const credentials = {
        ...this.loginForm.value,
        email: this.loginForm.value.email.trim()
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          const user = response.user;
          if (user.role === UserRole.ADMIN) {
            this.router.navigate(['/admin/dashboard']);
          } else if (user.role === UserRole.INSTRUCTOR) {
            this.router.navigate(['/dashboard/instructor']);
          } else {
            this.router.navigate(['/dashboard/student']);
          }
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Invalid email or password';
          this.loading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
