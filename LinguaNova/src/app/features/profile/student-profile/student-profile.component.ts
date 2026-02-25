import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CourseService } from '../../../core/services/course.service';
import { User } from '../../../core/models/user.model';
import { Course } from '../../../core/models/course.model';

@Component({
   selector: 'app-student-profile',
   standalone: true,
   imports: [CommonModule, ReactiveFormsModule],
   template: `
    <div class="bg-gray-50 min-h-screen py-10 font-sans">
      <div class="container mx-auto px-4 max-w-6xl">
        
        <!-- Header / Identity Section -->
        <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 mb-8 relative overflow-hidden">
           <!-- Decorative Background -->
           <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-teal-50/50 to-transparent rounded-bl-full -mr-20 -mt-20 pointer-events-none"></div>

           <div class="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <!-- Avatar -->
              <div class="relative group">
                 <div class="w-32 h-32 rounded-full border-[6px] border-white shadow-xl overflow-hidden bg-white ring-1 ring-gray-100">
                    <img [src]="user?.avatar || 'https://ui-avatars.com/api/?name=' + user?.firstName + '&size=256'" class="w-full h-full object-cover">
                 </div>
                 <button (click)="fileInput.click()" class="absolute bottom-1 right-1 p-2 bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all hover:scale-110">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                 </button>
                 <input #fileInput type="file" class="hidden" (change)="onFileSelected($event)" accept="image/*">
              </div>

              <!-- Info -->
              <div class="text-center md:text-left flex-1">
                 <div class="flex flex-col md:flex-row items-center gap-4 mb-2">
                    <h1 class="text-4xl font-bold text-gray-900 tracking-tight">{{ user?.firstName }} {{ user?.lastName }}</h1>
                    <div class="flex items-center gap-2">
                       <span class="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider rounded-lg border border-teal-100">Verified Student</span>
                    </div>
                 </div>
                 <p class="text-gray-500 font-medium text-lg mb-6">{{ user?.email }}</p>
                 
                 <div class="flex items-center justify-center md:justify-start gap-4">
                    @if (!isEditing) {
                       <button (click)="toggleEdit()" class="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all flex items-center gap-2">
                          Edit Profile
                       </button>

                    } @else {
                       <button (click)="cancelEdit()" class="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-all">
                          Cancel
                       </button>
                       <button (click)="saveProfile()" class="px-6 py-2.5 bg-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-200 hover:bg-teal-700 transition-all flex items-center gap-2">
                          {{ loading ? 'Saving...' : 'Save Changes' }}
                       </button>
                    }
                 </div>
              </div>
              
              <!-- Quick Stats Removed -->
           </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
           
           <!-- Left Column: Accolades & Trophies -->
           <div class="lg:col-span-4 space-y-8">
              <!-- Accolades Card -->
              <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
                 <div class="flex items-center justify-between mb-8">
                    <h3 class="text-xl font-bold text-gray-900 flex items-center gap-3">
                       <span class="w-10 h-10 bg-amber-100 text-amber-500 rounded-xl flex items-center justify-center">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>
                       </span>
                       Accolades
                    </h3>
                    <span class="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-lg">8 Earned</span>
                 </div>

                 <div class="grid grid-cols-2 gap-4">
                    @for (i of [1,2,3,4,5,6]; track i) {
                      <div class="aspect-square bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center relative group hover:shadow-lg hover:border-amber-200 transition-all cursor-pointer">
                         <div class="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300 transform group-hover:scale-110">🏆</div>
                         <div class="absolute inset-0 bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                      </div>
                    }
                    <div class="aspect-square border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center text-gray-400 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-all cursor-pointer">
                       <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    </div>
                 </div>
                 
                 <div class="mt-8 pt-8 border-t border-gray-100">
                    <div class="flex items-center justify-between text-sm mb-2">
                       <span class="font-bold text-gray-700">Next Rank</span>
                       <span class="font-bold text-teal-600">850/1000 XP</span>
                    </div>
                    <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                       <div class="h-full bg-gradient-to-r from-teal-500 to-teal-400 w-[85%] rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2 font-medium">Keep learning to reach Gold Tier!</p>
                 </div>
              </div>
           </div>

           <!-- Right Column: Personal Info (Editable) -->
           <div class="lg:col-span-8">
              <div class="bg-white rounded-[24px] shadow-sm border border-gray-100 p-8 md:p-10">
                 <div class="flex items-center justify-between mb-8">
                    <h3 class="text-xl font-bold text-gray-900">Personal Information</h3>
                    <p class="text-sm text-gray-500 font-medium">Manage your contact details and privacy</p>
                 </div>

                 <form [formGroup]="profileForm" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    <!-- First Name -->
                    <div class="space-y-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">First Name</label>
                       @if (isEditing) {
                          <input formControlName="firstName" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all font-medium text-gray-800">
                       } @else {
                          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">{{ user?.firstName }}</div>
                       }
                    </div>

                    <!-- Last Name -->
                    <div class="space-y-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Last Name</label>
                       @if (isEditing) {
                          <input formControlName="lastName" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all font-medium text-gray-800">
                       } @else {
                          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">{{ user?.lastName }}</div>
                       }
                    </div>

                    <!-- Email -->
                    <div class="space-y-2 md:col-span-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                       <div class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                          <span class="text-gray-800 font-medium">{{ user?.email }}</span>
                          <span class="ml-auto text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded">Verified</span>
                       </div>
                    </div>

                    <!-- Phone -->
                    <div class="space-y-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                       @if (isEditing) {
                          <input formControlName="phoneNumber" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all font-medium text-gray-800">
                       } @else {
                          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">{{ user?.phoneNumber || 'Not provided' }}</div>
                       }
                    </div>

                    <!-- Location -->
                    <div class="space-y-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</label>
                       @if (isEditing) {
                          <input formControlName="address" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all font-medium text-gray-800">
                       } @else {
                          <div class="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-800 font-medium">{{ user?.address || 'Not provided' }}</div>
                       }
                    </div>

                    <!-- Bio -->
                    <div class="md:col-span-2 space-y-2">
                       <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">Bio / Narrative</label>
                       @if (isEditing) {
                          <textarea formControlName="bio" rows="4" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-100 focus:border-teal-500 outline-none transition-all font-medium text-gray-800 resize-none"></textarea>
                       } @else {
                          <div class="p-6 bg-gray-50 rounded-xl border border-gray-100">
                             <p class="text-gray-600 italic leading-relaxed">"{{ user?.bio || 'Passionate learner exploring new languages and cultures through LinguaNova.' }}"</p>
                          </div>
                       }
                    </div>
                 </form>

                 <div class="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Security</p>
                        <p class="text-gray-600 font-medium mt-1">Last login: Today at 9:42 AM</p>
                    </div>
                    <button class="text-teal-600 font-bold text-sm tracking-wide hover:text-teal-800">Change Password</button>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
   styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    :host { display: block; }
  `]
})
export class StudentProfileComponent implements OnInit {
   authService = inject(AuthService);
   courseService = inject(CourseService);
   fb = inject(FormBuilder);

   user: User | null = null;
   profileForm!: FormGroup;
   isEditing = false;
   loading = false;

   enrolledCourses: Course[] = [];

   ngOnInit() {
      this.authService.currentUser$.subscribe(user => {
         this.user = user;
         this.initForm();
      });

      this.courseService.getEnrolledCourses().subscribe(courses => {
         this.enrolledCourses = courses;
      });
   }

   initForm() {
      if (!this.user) return;

      this.profileForm = this.fb.group({
         firstName: [this.user.firstName, Validators.required],
         lastName: [this.user.lastName, Validators.required],
         phoneNumber: [this.user.phoneNumber || ''],
         address: [this.user.address || ''],
         bio: [this.user.bio || '']
      });
   }

   toggleEdit() {
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
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

      const updatedUser: Partial<User> = {
         ...this.user,
         firstName: formValue.firstName,
         lastName: formValue.lastName,
         phoneNumber: formValue.phoneNumber,
         address: formValue.address,
         bio: formValue.bio
      };

      setTimeout(() => {
         this.authService.updateUser(updatedUser as User);
         this.loading = false;
         this.isEditing = false;
      }, 1000);
   }

   onFileSelected(event: any) {
      const file = event.target.files[0];
      if (file) {
         alert('Photo upload logic to be implemented!');
      }
   }
}
