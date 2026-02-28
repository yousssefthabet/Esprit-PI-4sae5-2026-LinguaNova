import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthLayoutComponent } from '../layout/auth-layout.component';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AuthLayoutComponent],
  template: `
    <app-auth-layout mode="register">
      
      <!-- User Type Selection (Segmented Control) -->
      <div class="mb-8">
        <div class="flex p-1 bg-gray-100 rounded-full w-full">
          <button 
            type="button" 
            (click)="setRole('student')"
            [class]="role === 'student' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            class="flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none uppercase tracking-wide"
          >
            Student
          </button>
          <button 
            type="button" 
            (click)="setRole('instructor')"
            [class]="role === 'instructor' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
            class="flex-1 py-3 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none uppercase tracking-wide"
          >
            Teacher
          </button>
        </div>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
        
        <!-- Email -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
          <input 
            type="email" 
            formControlName="email"
            class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 font-medium"
            placeholder="you@example.com"
            [class.border-red-500]="isFieldInvalid('email')"
          />
          @if (isFieldInvalid('email')) {
            <p class="text-xs text-red-500 pl-1 mt-1 font-medium">{{ getErrorMessage('email') }}</p>
          }
        </div>

        <!-- Student Fields -->
        @if (role === 'student') {
          <div class="space-y-2">
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">User Name</label>
            <input 
              type="text" 
              formControlName="username"
              class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all placeholder:text-gray-300 text-gray-800 font-medium"
              placeholder="johndoe123"
              [class.border-red-500]="isFieldInvalid('username')"
            />
            @if (isFieldInvalid('username')) {
              <p class="text-xs text-red-500 pl-1 mt-1 font-medium">{{ getErrorMessage('username') }}</p>
            }
          </div>
        }

        <!-- Instructor Fields -->
        @if (role === 'instructor') {
          <div class="grid grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">First Name</label>
              <input type="text" formControlName="firstName" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" [class.border-red-500]="isFieldInvalid('firstName')"/>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Last Name</label>
              <input type="text" formControlName="lastName" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" [class.border-red-500]="isFieldInvalid('lastName')"/>
            </div>
          </div>

          <div class="space-y-2">
             <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
             <input type="tel" formControlName="phoneNumber" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" placeholder="+1 (555) 000-0000" />
          </div>

          <div class="grid grid-cols-2 gap-5">
            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Date of Birth</label>
              <input type="date" formControlName="dateOfBirth" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all text-gray-500" />
            </div>
            <div class="space-y-2">
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Teaching Exp. (Years)</label>
              <input type="number" formControlName="teachingExperience" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" placeholder="5" />
            </div>
          </div>
          
           <div class="space-y-2">
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Highest Education</label>
            <div class="relative">
              <select formControlName="educationLevel" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all appearance-none text-gray-800">
                <option value="">Select Level</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="phd">PhD / Doctorate</option>
                <option value="other">Other Certification</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div class="space-y-2">
             <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Certification Number</label>
             <input type="text" formControlName="certificationNumber" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" placeholder="LIC-12345678" />
          </div>

          <div class="space-y-2">
             <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Subject Specializations</label>
             <input type="text" formControlName="subjectSpecializations" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all" placeholder="e.g. Mathematics, Physics..." />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Grade Levels Taught</label>
            <div class="flex flex-wrap gap-3">
               <label class="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                 <input type="checkbox" (change)="onGradeLevelChange($event, 'K-12')" class="text-[#5FCFC5] focus:ring-[#5FCFC5] rounded border-gray-300" />
                 <span class="text-sm font-medium text-gray-700">K-12</span>
               </label>
               <label class="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                 <input type="checkbox" (change)="onGradeLevelChange($event, 'College')" class="text-[#5FCFC5] focus:ring-[#5FCFC5] rounded border-gray-300" />
                 <span class="text-sm font-medium text-gray-700">College</span>
               </label>
               <label class="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors bg-white">
                 <input type="checkbox" (change)="onGradeLevelChange($event, 'Adult Education')" class="text-[#5FCFC5] focus:ring-[#5FCFC5] rounded border-gray-300" />
                 <span class="text-sm font-medium text-gray-700">Adult Ed</span>
               </label>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Profile Photo</label>
             <input type="file" (change)="onFileSelected($event)" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#5FCFC5]/10 file:text-[#5FCFC5] hover:file:bg-[#5FCFC5]/20 transition-all cursor-pointer"/>
          </div>
        }

        <!-- Password -->
        <div class="space-y-2">
          <label class="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Password</label>
          <div class="relative">
            <input 
              [type]="showPassword ? 'text' : 'password'" 
              formControlName="password"
              class="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-[#5FCFC5] focus:ring-4 focus:ring-[#5FCFC5]/10 outline-none transition-all pr-12 text-gray-800 tracking-widest"
              [class.border-red-500]="isFieldInvalid('password')"
              placeholder="•••••••••"
            />
            <button type="button" (click)="togglePasswordVisibility()" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#5FCFC5] transition-colors focus:outline-none">
               <span class="text-xs font-semibold uppercase tracking-wider">{{ showPassword ? 'Hide' : 'Show' }}</span>
            </button>
          </div>
          @if (isFieldInvalid('password')) {
            <p class="text-xs text-red-500 pl-1 mt-1 font-medium">{{ getErrorMessage('password') }}</p>
          }
        </div>

        @if (errorMessage) {
          <div class="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-sm text-red-600 font-medium">{{ errorMessage }}</p>
          </div>
        }

        <button 
          type="submit" 
          [disabled]="registerForm.invalid || loading"
          class="w-full py-4 mt-8 bg-[#5FCFC5] hover:bg-[#4bc2b8] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#5FCFC5]/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-lg tracking-wide"
        >
          {{ loading ? 'Creating Account...' : (role === 'student' ? 'Register as Student' : 'Register as Teacher') }}
        </button>
      </form>
    </app-auth-layout>
  `,
  styles: []
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  registerForm: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  role: 'student' | 'instructor' = 'student';
  selectedGradeLevels: string[] = [];

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      // Student
      username: ['', [Validators.required, Validators.minLength(2)]],
      // Instructor
      firstName: [''],
      lastName: [''],
      phoneNumber: [''],
      dateOfBirth: [''],
      educationLevel: [''],
      certificationNumber: [''],
      teachingExperience: [''],
      subjectSpecializations: [''],
      profilePhoto: [null]
    });
  }

  setRole(role: 'student' | 'instructor') {
    this.role = role;
    const controls = this.registerForm.controls;

    if (role === 'student') {
      controls['username'].setValidators([Validators.required, Validators.minLength(2)]);
      controls['firstName'].clearValidators();
      controls['lastName'].clearValidators();
      // Clear instructor validators
      ['phoneNumber', 'dateOfBirth', 'educationLevel', 'certificationNumber', 'teachingExperience', 'subjectSpecializations'].forEach(field => {
        controls[field].clearValidators();
      });
    } else {
      controls['username'].clearValidators();
      controls['firstName'].setValidators([Validators.required]);
      controls['lastName'].setValidators([Validators.required]);
      controls['phoneNumber'].setValidators([Validators.required]);
      controls['educationLevel'].setValidators([Validators.required]);
      // Add other validators as needed
    }

    // Update validity for all controls
    Object.keys(controls).forEach(key => controls[key].updateValueAndValidity());
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onGradeLevelChange(event: any, level: string) {
    if (event.target.checked) {
      this.selectedGradeLevels.push(level);
    } else {
      this.selectedGradeLevels = this.selectedGradeLevels.filter(l => l !== level);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.registerForm.patchValue({ profilePhoto: file });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.touched && control?.errors);
  }

  getErrorMessage(field: string): string {
    const control = this.registerForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) return `Must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formValue = this.registerForm.value;

      const registerData: any = {
        email: formValue.email.trim(),
        password: formValue.password,
        confirmPassword: formValue.password,
        firstName: this.role === 'student' ? formValue.username?.trim().split(' ')[0] || '' : formValue.firstName,
        lastName: this.role === 'student' ? formValue.username?.trim().split(' ').slice(1).join(' ') || '.' : formValue.lastName,
        role: this.role === 'student' ? UserRole.STUDENT : UserRole.INSTRUCTOR,
        agreeToTerms: true,
      };

      if (this.role === 'student') {
        registerData.username = formValue.username?.trim() || formValue.email.split('@')[0];
      } else {
        registerData.phoneNumber = formValue.phoneNumber || undefined;
        registerData.dateOfBirth = formValue.dateOfBirth || undefined;
        registerData.educationLevel = formValue.educationLevel || undefined;
        registerData.highestEducation = formValue.educationLevel || undefined;
        registerData.certificationNumber = formValue.certificationNumber || undefined;
        registerData.teachingExperience = formValue.teachingExperience || undefined;
        registerData.subjectSpecializations = formValue.subjectSpecializations ? [formValue.subjectSpecializations.trim()] : [];
        registerData.gradeLevels = this.selectedGradeLevels;
      }

      this.authService.register(registerData).subscribe({
        next: () => {
          if (this.role === 'instructor') {
            this.router.navigate(['/dashboard/instructor']);
          } else {
            this.router.navigate(['/dashboard/student']);
          }
        },
        error: (error) => {
          const body = error?.error;
          const msg = body?.message || (error?.status === 500
            ? 'Server error. Is the user-service running on port 8082? Check its console for details.'
            : 'Registration failed. Please try again.');
          this.errorMessage = msg;
          this.loading = false;
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
