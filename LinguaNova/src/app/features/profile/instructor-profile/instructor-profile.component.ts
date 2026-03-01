import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
    selector: 'app-instructor-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="min-h-screen bg-[#F7FAFC] py-10 px-4 sm:px-6 lg:px-8 flex justify-center">
      @if (loading && !user) {
        <div class="flex flex-col items-center justify-center gap-4 py-20">
          <div class="w-10 h-10 border-2 border-[#3A5A5A] border-t-transparent rounded-full animate-spin"></div>
          <p class="text-[#718096] font-medium">Loading your profile...</p>
        </div>
      } @else if (errorMessage) {
        <div class="max-w-[1200px] w-full bg-white rounded-[12px] shadow-sm p-10 text-center">
          <p class="text-red-600 mb-4">{{ errorMessage }}</p>
          <button (click)="retryLoad()" class="px-6 py-3 bg-[#3A5A5A] text-white rounded-lg hover:bg-[#2D4D4D] font-medium">Retry</button>
        </div>
      } @else if (user) {
      <div class="max-w-[1200px] w-full bg-white rounded-[12px] shadow-sm p-10 relative">
        
        <!-- Header Section -->
        <div class="flex flex-col md:flex-row gap-8 mb-10 border-b border-gray-100 pb-10">
          <!-- Profile Photo (user-service: profilePhoto) -->
          <div class="flex flex-col items-center">
            <div class="w-[150px] h-[150px] rounded-full border-4 border-[#3A5A5A] overflow-hidden mb-4 relative group">
              <img 
                [src]="profileImageUrl" 
                alt="Profile Photo" 
                class="w-full h-full object-cover"
              >
              <!-- Hover Edit Overlay -->
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" (click)="fileInput.click()">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <button (click)="fileInput.click()" class="text-sm font-medium text-[#3A5A5A] hover:text-[#2D6F6B] focus:outline-none">
              Change Photo
            </button>
            <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
          </div>

          <!-- Basic Info (user-service: firstName, lastName, email) -->
          <div class="flex-1 flex flex-col justify-center">
            <div class="flex justify-between items-start">
              <div>
                <h1 class="text-[32px] font-bold text-[#2D3748] mb-2">{{ displayName }}</h1>
                <div class="flex items-center text-[#718096] gap-2 mb-4">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  <span>{{ user.email }}</span>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="flex flex-col gap-3 items-end">
                @if (!isEditing) {
                  <button (click)="toggleEdit()" class="flex items-center gap-2 px-6 py-3 bg-[#3A5A5A] text-white rounded-lg hover:bg-[#2D4D4D] transition-colors shadow-sm font-medium">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    Edit Profile
                  </button>
                } @else {
                  <div class="flex gap-3">
                    <button (click)="cancelEdit()" class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Cancel
                    </button>
                    <button (click)="saveProfile()" class="px-6 py-3 bg-[#3A5A5A] text-white rounded-lg hover:bg-[#2D4D4D] transition-colors shadow-sm font-medium" [disabled]="profileForm.invalid || loading">
                      {{ loading ? 'Saving...' : 'Save Changes' }}
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <form [formGroup]="profileForm">
          <div class="space-y-10">
            <!-- 1. Personal Information -->
            <section>
              <h2 class="text-xl font-bold text-[#3A5A5A] mb-6 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Personal Information
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- First Name -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">First Name</label>
                  @if (isEditing) {
                    <input formControlName="firstName" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <p class="text-base text-[#2D3748] font-medium py-2">{{ user.firstName }}</p>
                  }
                </div>
                <!-- Last Name -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Last Name</label>
                  @if (isEditing) {
                    <input formControlName="lastName" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <p class="text-base text-[#2D3748] font-medium py-2">{{ user.lastName }}</p>
                  }
                </div>
                <!-- Email -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Email Address</label>
                  <div class="flex items-center gap-2 py-2">
                    <svg class="w-4 h-4 text-[#3A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    <p class="text-base text-[#2D3748] font-medium">{{ user.email }}</p>
                  </div>
                </div>
                <!-- Phone -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Phone Number</label>
                  @if (isEditing) {
                    <input formControlName="phoneNumber" type="tel" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <div class="flex items-center gap-2 py-2">
                      <svg class="w-4 h-4 text-[#3A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      <p class="text-base text-[#2D3748] font-medium">{{ user.phoneNumber || 'Not provided' }}</p>
                    </div>
                  }
                </div>
                <!-- Date of Birth -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Date of Birth</label>
                  @if (isEditing) {
                    <input formControlName="dateOfBirth" type="date" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <div class="flex items-center gap-2 py-2">
                      <svg class="w-4 h-4 text-[#3A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p class="text-base text-[#2D3748] font-medium">{{ user.dateOfBirth ? (user.dateOfBirth | date:'longDate') : 'Not provided' }}</p>
                    </div>
                  }
                </div>
              </div>
            </section>

            <!-- 2. Professional Credentials -->
            <section>
              <h2 class="text-xl font-bold text-[#3A5A5A] mb-6 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                Professional Credentials
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <!-- Highest Education -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Highest Education</label>
                  @if (isEditing) {
                    <select formControlName="educationLevel" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD / Doctorate</option>
                      <option value="other">Other Certification</option>
                    </select>
                  } @else {
                    <div class="flex items-center gap-2 py-2">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-[#E6F7F5] text-[#3A5A5A]">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>
                        {{ educationLevelLabel }}
                      </span>
                    </div>
                  }
                </div>
                <!-- Certification Number -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Certification Number</label>
                  @if (isEditing) {
                    <input formControlName="certificationNumber" type="text" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <p class="text-base text-[#2D3748] font-medium py-2">{{ user.certificationNumber || 'N/A' }}</p>
                  }
                </div>
                <!-- Teaching Experience -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Teaching Experience</label>
                  @if (isEditing) {
                    <input formControlName="teachingExperience" type="number" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                  } @else {
                    <div class="flex items-center gap-2 py-2">
                       <svg class="w-4 h-4 text-[#3A5A5A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <p class="text-base text-[#2D3748] font-medium">{{ user.teachingExperience || 0 }} Years</p>
                    </div>
                  }
                </div>
              </div>
            </section>

            <!-- 3. Teaching Specialization -->
            <section>
              <h2 class="text-xl font-bold text-[#3A5A5A] mb-6 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                Teaching Specialization
              </h2>
              <div class="space-y-6">
                <!-- Subject Specializations -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Subject Specializations</label>
                  @if (isEditing) {
                    <input formControlName="subjectSpecializations" type="text" placeholder="e.g. Math, Physics (comma separated)" class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#3A5A5A] focus:ring-1 focus:ring-[#3A5A5A] outline-none transition-all text-[#2D3748]">
                    <p class="text-xs text-gray-500 mt-1">Separate subjects with commas</p>
                  } @else {
                    <div class="flex flex-wrap gap-2 py-2">
                      @for (subject of getSubjects(); track subject) {
                        <span class="px-3 py-1 rounded-full bg-[#3A5A5A] text-white text-sm font-medium">{{ subject }}</span>
                      } @empty {
                        <p class="text-gray-400 italic">No specializations listed</p>
                      }
                    </div>
                  }
                </div>
                <!-- Grade Levels Taught -->
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Grade Levels Taught</label>
                  @if (isEditing) {
                    <div class="flex flex-wrap gap-4">
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" [checked]="hasGradeLevel('K-12')" (change)="toggleGradeLevel('K-12')" class="text-[#3A5A5A] rounded border-gray-300 focus:ring-[#3A5A5A]">
                        <span class="text-sm text-gray-700">K-12</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" [checked]="hasGradeLevel('College')" (change)="toggleGradeLevel('College')" class="text-[#3A5A5A] rounded border-gray-300 focus:ring-[#3A5A5A]">
                        <span class="text-sm text-gray-700">College</span>
                      </label>
                      <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" [checked]="hasGradeLevel('Adult Education')" (change)="toggleGradeLevel('Adult Education')" class="text-[#3A5A5A] rounded border-gray-300 focus:ring-[#3A5A5A]">
                        <span class="text-sm text-gray-700">Adult Education</span>
                      </label>
                    </div>
                  } @else {
                    <div class="flex flex-wrap gap-3 py-2">
                      <span class="px-4 py-1.5 rounded-lg text-sm font-medium border" [class.bg-teal-50]="hasGradeLevel('K-12')" [class.border-teal-200]="hasGradeLevel('K-12')" [class.text-teal-800]="hasGradeLevel('K-12')" [class.bg-gray-50]="!hasGradeLevel('K-12')" [class.text-gray-400]="!hasGradeLevel('K-12')">K-12</span>
                      <span class="px-4 py-1.5 rounded-lg text-sm font-medium border" [class.bg-teal-50]="hasGradeLevel('College')" [class.border-teal-200]="hasGradeLevel('College')" [class.text-teal-800]="hasGradeLevel('College')" [class.bg-gray-50]="!hasGradeLevel('College')" [class.text-gray-400]="!hasGradeLevel('College')">College</span>
                      <span class="px-4 py-1.5 rounded-lg text-sm font-medium border" [class.bg-teal-50]="hasGradeLevel('Adult Education')" [class.border-teal-200]="hasGradeLevel('Adult Education')" [class.text-teal-800]="hasGradeLevel('Adult Education')" [class.bg-gray-50]="!hasGradeLevel('Adult Education')" [class.text-gray-400]="!hasGradeLevel('Adult Education')">Adult Education</span>
                    </div>
                  }
                </div>
              </div>
            </section>

            <!-- 4. Account Security -->
            <section>
              <h2 class="text-xl font-bold text-[#3A5A5A] mb-6 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                Account Security
              </h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 items-center">
                <div class="space-y-2">
                  <label class="text-xs font-medium text-[#718096] uppercase tracking-wider">Password</label>
                  <p class="text-2xl text-[#2D3748] tracking-widest font-medium">••••••••</p>
                </div>
                <div>
                  <button (click)="changePassword()" class="px-5 py-2 border border-[#3A5A5A] text-[#3A5A5A] rounded-lg hover:bg-teal-50 transition-colors text-sm font-medium">
                    Change Password
                  </button>
                </div>
              </div>
            </section>
          </div>
        </form>
      </div>
      }
    </div>
  `,
    styles: []
})
export class InstructorProfileComponent implements OnInit {
    authService = inject(AuthService);
    fb = inject(FormBuilder);

    user: User | null = null;
    profileForm!: FormGroup;
    isEditing = false;
    loading = false;
    errorMessage: string | null = null;

    // Temporary storage for grade levels when editing
    editedGradeLevels: string[] = [];

    /** Display name: first + last from user-service, or email if no names */
    get displayName(): string {
        if (!this.user) return '';
        const first = (this.user.firstName ?? '').trim();
        const last = (this.user.lastName ?? '').trim();
        const name = [first, last].filter(Boolean).join(' ');
        return name || this.user.email || 'Instructor';
    }

    /** Profile image: user-service profilePhoto (mapped to avatar) or ui-avatars fallback */
    get profileImageUrl(): string {
        if (this.user?.avatar) return this.user.avatar;
        const name = this.displayName || 'Instructor';
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2D6F6B&color=fff`;
    }

    /** highestEducation from user-service shown with friendly label */
    get educationLevelLabel(): string {
        const v = this.user?.educationLevel?.trim();
        if (!v) return 'Not specified';
        const map: Record<string, string> = {
            bachelor: "Bachelor's Degree",
            master: "Master's Degree",
            phd: 'PhD / Doctorate',
            other: 'Other Certification'
        };
        return map[v.toLowerCase()] ?? v;
    }

    ngOnInit() {
        this.loadProfile();
    }

    loadProfile() {
        this.loading = true;
        this.errorMessage = null;
        this.authService.getCurrentUser().subscribe({
            next: (user) => {
                this.user = user;
                this.initForm();
                this.loading = false;
            },
            error: () => {
                this.errorMessage = 'Could not load profile. Check your connection and try again.';
                this.loading = false;
                this.user = this.authService.currentUserValue;
                if (this.user) this.initForm();
            }
        });
    }

    retryLoad() {
        this.loadProfile();
    }

    initForm() {
        if (!this.user) return;

        // Format subjects array to comma-separated string for input
        const subjects = this.user.subjectSpecializations?.join(', ') || '';

        this.profileForm = this.fb.group({
            firstName: [this.user.firstName, Validators.required],
            lastName: [this.user.lastName, Validators.required],
            phoneNumber: [this.user.phoneNumber || ''],
            dateOfBirth: [this.user.dateOfBirth ? new Date(this.user.dateOfBirth).toISOString().split('T')[0] : ''],
            educationLevel: [this.user.educationLevel || ''],
            certificationNumber: [this.user.certificationNumber || ''],
            teachingExperience: [this.user.teachingExperience || 0],
            subjectSpecializations: [subjects]
        });

        this.editedGradeLevels = [...(this.user.gradeLevels || [])];
    }

    toggleEdit() {
        this.isEditing = !this.isEditing;
        if (!this.isEditing) {
            // Reset form if cancelled
            this.initForm();
        }
    }

    cancelEdit() {
        this.isEditing = false;
        this.initForm();
    }

    saveProfile() {
        if (this.profileForm.invalid) return;
        this.loading = true;

        const formValue = this.profileForm.value;

        // Process subjects string back to array
        const specs = formValue.subjectSpecializations
            ? formValue.subjectSpecializations.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
            : [];

        const updatedUser: Partial<User> = {
            ...this.user,
            firstName: formValue.firstName,
            lastName: formValue.lastName,
            phoneNumber: formValue.phoneNumber,
            dateOfBirth: formValue.dateOfBirth ? new Date(formValue.dateOfBirth) : undefined,
            educationLevel: formValue.educationLevel,
            certificationNumber: formValue.certificationNumber,
            teachingExperience: formValue.teachingExperience,
            subjectSpecializations: specs,
            gradeLevels: this.editedGradeLevels
        };

        this.authService.updateUser(updatedUser as User).subscribe({
            next: (u) => {
                this.user = u;
                this.loading = false;
                this.isEditing = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            // Handle file upload logic here
            // For now, simple alert
            alert('Photo upload logic to be implemented!');
        }
    }

    changePassword() {
        alert('Change password modal to be implemented!');
    }

    getSubjects(): string[] {
        return this.user?.subjectSpecializations || [];
    }

    hasGradeLevel(level: string): boolean {
        if (this.isEditing) {
            return this.editedGradeLevels.includes(level);
        }
        return this.user?.gradeLevels?.includes(level) || false;
    }

    toggleGradeLevel(level: string) {
        if (this.editedGradeLevels.includes(level)) {
            this.editedGradeLevels = this.editedGradeLevels.filter(l => l !== level);
        } else {
            this.editedGradeLevels.push(level);
        }
    }
}
