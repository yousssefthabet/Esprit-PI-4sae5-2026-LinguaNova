import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';

@Component({
  selector: 'app-event-creation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, CardComponent],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen py-16 font-sans">
      <div class="container mx-auto px-4 max-w-[1000px]">
        
        <!-- Header with Back Button -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div>
            <div class="flex items-center gap-3 mb-2">
               <button (click)="goBack()" class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:border-teal-100 transition-all shadow-sm">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
               </button>
               <span class="text-gray-300">/</span>
               <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Event Planner</span>
            </div>
            <h1 class="text-4xl font-black text-gray-900 tracking-tight">Create Live Event</h1>
          </div>
          <div class="hidden md:block">
             <div class="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                   <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                   <p class="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                   <p class="text-sm font-bold text-gray-700">Drafting Session</p>
                </div>
             </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-12 gap-10">
          <!-- Main Form Column -->
          <div class="lg:col-span-8">
            <app-card class="p-8 md:p-10 rounded-[32px] border-none shadow-xl shadow-gray-200/40">
              <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="space-y-10">
                
                <!-- Section 1: Core Details -->
                <section>
                  <div class="flex items-center gap-4 mb-8">
                     <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0D9488]">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                     </div>
                     <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase tracking-wider">General Information</h2>
                  </div>

                  <div class="space-y-6">
                    <app-input
                      label="Event Title"
                      placeholder="e.g., Advanced English Conversation Mastery"
                      formControlName="title"
                      [error]="getErrorMessage('title')"
                      [required]="true"
                    />
                    
                    <div>
                      <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Session Description</label>
                      <textarea 
                        formControlName="description"
                        rows="4"
                        class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all outline-none resize-none text-gray-700 placeholder:text-gray-300 shadow-sm"
                        placeholder="What will your students achieve in this session?"
                      ></textarea>
                      @if (getErrorMessage('description')) {
                        <span class="text-[10px] font-bold text-red-500 mt-2 block ml-1">{{ getErrorMessage('description') }}</span>
                      }
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <app-input
                        label="Category"
                        placeholder="e.g., Vocabulary"
                        formControlName="category"
                        [error]="getErrorMessage('category')"
                        [required]="true"
                      />
                      <app-input
                        label="Event Type"
                        placeholder="e.g., Interactive Workshop"
                        formControlName="type"
                        [error]="getErrorMessage('type')"
                        [required]="true"
                      />
                    </div>
                  </div>
                </section>

                <hr class="border-gray-50" />

                <!-- Section 2: Timing -->
                <section>
                  <div class="flex items-center gap-4 mb-8">
                     <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                     <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase tracking-wider">Date & Schedule</h2>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <app-input
                      label="Event Date"
                      type="date"
                      formControlName="date"
                      [error]="getErrorMessage('date')"
                      [required]="true"
                    />
                    <app-input
                      label="Start At"
                      type="time"
                      formControlName="startTime"
                      [error]="getErrorMessage('startTime')"
                      [required]="true"
                    />
                    <app-input
                      label="Ends At"
                      type="time"
                      formControlName="endTime"
                      [error]="getErrorMessage('endTime')"
                      [required]="true"
                    />
                  </div>
                </section>

                <!-- Section 3: Connectivity -->
                <section>
                  <div class="flex items-center gap-4 mb-8">
                     <div class="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                     </div>
                     <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase tracking-wider">Virtual Classroom</h2>
                  </div>
                  <app-input
                    label="Meeting Link"
                    placeholder="https://zoom.us/j/..."
                    formControlName="meetingUrl"
                    [error]="getErrorMessage('meetingUrl')"
                    [required]="true"
                  />
                </section>

                <!-- Form Actions -->
                <div class="pt-8 flex flex-col sm:flex-row gap-4">
                  <button 
                    type="submit" 
                    [disabled]="!eventForm.valid || loading"
                    class="flex-1 py-4 bg-[#0D9488] hover:bg-[#0D5E5B] text-white font-bold rounded-2xl shadow-lg shadow-teal-100 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    @if (loading) {
                      <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    }
                    Schedule Event
                  </button>
                  <button 
                    type="button" 
                    (click)="goBack()"
                    [disabled]="loading"
                    class="flex-1 py-4 bg-white border border-gray-100 hover:border-gray-200 text-gray-400 font-bold rounded-2xl transition-all"
                  >
                    Discard Draft
                  </button>
                </div>
              </form>
            </app-card>
          </div>

          <!-- Sidebar Tips -->
          <div class="lg:col-span-4 space-y-6">
            <div class="bg-gradient-to-br from-[#0D9488] to-[#0D5E5B] p-8 rounded-[32px] text-white shadow-xl shadow-teal-100">
               <h3 class="text-xl font-bold mb-4">Pro Tips 💡</h3>
               <ul class="space-y-4 text-sm opacity-90 font-medium list-disc ml-4">
                 <li>Keep titles short and catchy to attract more students.</li>
                 <li>Set sessions to at least 45 minutes for best results.</li>
                 <li>Include the meeting URL early so students can book.</li>
               </ul>
            </div>

            <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
               <h3 class="font-black text-gray-900 mb-6 uppercase tracking-widest text-xs">Recently Scheduled</h3>
               <div class="space-y-6">
                  <div class="flex items-center gap-4">
                     <div class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-[#0D9488]">
                        <span class="text-[8px] font-black uppercase">MAY</span>
                        <span class="text-sm font-black">12</span>
                     </div>
                     <div>
                        <p class="text-sm font-bold text-gray-800 leading-tight">IELTS Prep Session</p>
                        <p class="text-[10px] font-bold text-gray-400">14:00 • 45 min</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <!-- Success Overlay -->
        @if (showSuccess) {
          <div class="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
            <div class="bg-white rounded-[40px] p-10 max-w-sm w-full text-center shadow-2xl animate-scale-in border border-gray-100">
              <div class="w-24 h-24 bg-teal-50 text-[#0D9488] rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 class="text-3xl font-black text-gray-900 mb-2">Great Success!</h3>
              <p class="text-gray-500 font-medium mb-10 leading-relaxed">Your live session has been broadcasted to all enrolled students.</p>
              <button (click)="goBack()" class="w-full py-4 bg-[#0D9488] text-white font-black rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">
                Finish Setup
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    .animate-scale-in {
      animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes scaleIn {
      from { transform: scale(0.8) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
    :host { display: block; }
  `]
})
export class EventCreationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  eventForm: FormGroup;
  loading = false;
  showSuccess = false;

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      type: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      meetingUrl: ['', [Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        this.showSuccess = true;
      }, 1500);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.eventForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Required field';
      if (control.errors['minlength']) return `Min ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) return 'Invalid URL format';
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard/instructor']);
  }
}
