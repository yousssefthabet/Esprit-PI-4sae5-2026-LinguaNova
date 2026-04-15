import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputComponent } from '../../../shared/components/input/input.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { finalize } from 'rxjs';
import { BackendEventCreateRequest, BackendEventType, EventService } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import * as L from 'leaflet';

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

                    <div class="space-y-6">
                      <app-input
                        label="Category"
                        placeholder="e.g., Vocabulary"
                        formControlName="category"
                        [error]="getErrorMessage('category')"
                        [required]="true"
                      />
                      <div>
                        <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Event Type</label>
                        <div class="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            (click)="setEventType('REAL_LIFE')"
                            [class]="eventForm.get('eventType')?.value === 'REAL_LIFE'
                              ? 'p-4 rounded-2xl border-2 border-[#0D9488] bg-teal-50 text-[#0D9488] shadow-sm'
                              : 'p-4 rounded-2xl border border-gray-100 bg-white text-gray-500 hover:border-gray-200 transition-all'"
                          >
                            <div class="flex items-center justify-between">
                              <div class="text-left">
                                <div class="text-xs font-black uppercase tracking-widest">Real life</div>
                                <div class="text-[11px] font-bold opacity-80 mt-1">Pick a place on map</div>
                              </div>
                              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                              </div>
                            </div>
                          </button>

                          <button
                            type="button"
                            (click)="setEventType('LIVE_MEETING')"
                            [class]="eventForm.get('eventType')?.value === 'LIVE_MEETING'
                              ? 'p-4 rounded-2xl border-2 border-[#0D9488] bg-teal-50 text-[#0D9488] shadow-sm'
                              : 'p-4 rounded-2xl border border-gray-100 bg-white text-gray-500 hover:border-gray-200 transition-all'"
                          >
                            <div class="flex items-center justify-between">
                              <div class="text-left">
                                <div class="text-xs font-black uppercase tracking-widest">Live meeting</div>
                                <div class="text-[11px] font-bold opacity-80 mt-1">Provide a meeting link</div>
                              </div>
                              <div class="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                              </div>
                            </div>
                          </button>
                        </div>
                        @if (getErrorMessage('eventType')) {
                          <span class="text-[10px] font-bold text-red-500 mt-2 block ml-1">{{ getErrorMessage('eventType') }}</span>
                        }
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Event Photo</label>
                      <div class="flex items-center gap-4">
                        <label class="px-5 py-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all cursor-pointer font-bold text-gray-600">
                          Choose photo
                          <input type="file" accept="image/*" class="hidden" (change)="onImageSelected($event)" />
                        </label>
                        <button type="button" class="px-5 py-3 rounded-2xl border border-gray-100 bg-white hover:border-gray-200 transition-all font-bold text-gray-500" (click)="removeImage()" [disabled]="!imagePreview">
                          Remove
                        </button>
                      </div>
                      @if (imagePreview) {
                        <div class="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                          <img [src]="imagePreview" alt="Event preview" class="w-full h-[200px] object-cover" />
                        </div>
                      }
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

                <hr class="border-gray-50" />

                <!-- Section 2.5: Capacity -->
                <section>
                  <div class="flex items-center gap-4 mb-8">
                     <div class="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a4 4 0 00-4-4h-1m-4 6H2v-2a4 4 0 014-4h1m6 6v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0zm6 2a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     </div>
                     <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase tracking-wider">Capacity</h2>
                  </div>

                  <app-input
                    label="Max attendees"
                    type="number"
                    placeholder="e.g., 50"
                    formControlName="maxAttendees"
                    [error]="getErrorMessage('maxAttendees')"
                    [required]="true"
                  />
                </section>

                <!-- Section 3: Location / Virtual Classroom -->
                @if (eventForm.get('eventType')?.value === 'LIVE_MEETING') {
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
                }

                @if (eventForm.get('eventType')?.value === 'REAL_LIFE') {
                  <section>
                    <div class="flex items-center gap-4 mb-8">
                      <div class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <h2 class="text-xl font-black text-gray-900 tracking-tight uppercase tracking-wider">Real Life Location</h2>
                    </div>

                    <div class="mt-6">
                      <label class="block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Select on map (click)</label>
                      <div #mapContainer class="w-full h-[320px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm"></div>
                      @if (eventForm.get('latitude')?.value && eventForm.get('longitude')?.value) {
                        <div class="mt-3 text-[11px] font-bold text-gray-500">
                          Selected: {{ eventForm.get('latitude')?.value }}, {{ eventForm.get('longitude')?.value }}
                        </div>
                      }
                      @if (reverseGeocodeLoading) {
                        <div class="mt-2 text-[11px] font-bold text-gray-400">
                          Detecting place name...
                        </div>
                      } @else if (eventForm.get('locationName')?.value) {
                        <div class="mt-2 text-[11px] font-bold text-gray-700">
                          Place: {{ eventForm.get('locationName')?.value }}
                        </div>
                      }
                      @if (getErrorMessage('latitude') || getErrorMessage('longitude')) {
                        <div class="mt-2 text-[10px] font-bold text-red-500">
                          Please click on the map to choose a location.
                        </div>
                      }
                    </div>
                  </section>
                }

                <!-- Form Actions -->
                <div class="pt-8 flex flex-col sm:flex-row gap-4">
                  @if (errorMessage) {
                    <div class="w-full text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                      {{ errorMessage }}
                    </div>
                  }
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
export class EventCreationComponent implements AfterViewInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map?: L.Map;
  private marker?: L.CircleMarker;
  reverseGeocodeLoading = false;
  imagePreview: string | null = null;
  private readonly MAX_IMAGE_BYTES = 600_000; // ~600KB to stay under MySQL default max_allowed_packet

  eventForm: FormGroup;
  loading = false;
  showSuccess = false;
  errorMessage = '';
  private editingId: number | null = null;

  constructor() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category: ['', Validators.required],
      eventType: ['', Validators.required],
      date: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxAttendees: [null, [Validators.required, Validators.min(1)]],
      imageUrl: [''],
      meetingUrl: [''],
      locationName: [''],
      latitude: [null],
      longitude: [null]
    });

    this.onEventTypeChanged();
    this.initEditModeIfNeeded();
  }

  ngAfterViewInit(): void {
    this.initMapIfNeeded();
  }

  ngOnDestroy(): void {
    this.destroyMap();
  }

  onEventTypeChanged(): void {
    const type = this.eventForm.get('eventType')?.value as BackendEventType | '';

    const meetingUrl = this.eventForm.get('meetingUrl');
    const locationName = this.eventForm.get('locationName');
    const latitude = this.eventForm.get('latitude');
    const longitude = this.eventForm.get('longitude');

    meetingUrl?.clearValidators();
    latitude?.clearValidators();
    longitude?.clearValidators();

    if (type === 'LIVE_MEETING') {
      meetingUrl?.setValidators([Validators.required, Validators.pattern(/^(http|https):\/\/[^ "]+$/)]);
      locationName?.setValue('');
      latitude?.setValue(null);
      longitude?.setValue(null);
      this.destroyMap();
    } else if (type === 'REAL_LIFE') {
      latitude?.setValidators([Validators.required]);
      longitude?.setValidators([Validators.required]);
      meetingUrl?.setValue('');
      setTimeout(() => this.initMapIfNeeded(), 0);
    } else {
      this.destroyMap();
    }

    meetingUrl?.updateValueAndValidity();
    locationName?.updateValueAndValidity();
    latitude?.updateValueAndValidity();
    longitude?.updateValueAndValidity();
  }

  setEventType(type: BackendEventType): void {
    this.eventForm.patchValue({ eventType: type });
    this.onEventTypeChanged();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) return;

    if (file.size > this.MAX_IMAGE_BYTES) {
      this.errorMessage = `Image is too large. Please choose an image under ${Math.round(
        this.MAX_IMAGE_BYTES / 1000
      )}KB (your file is ${Math.round(file.size / 1000)}KB).`;
      this.removeImage();
      if (input) input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.imagePreview = result;
      this.eventForm.patchValue({ imageUrl: result ?? '' });
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.eventForm.patchValue({ imageUrl: '' });
  }

  private async reverseGeocode(lat: number, lng: number): Promise<void> {
    this.reverseGeocodeLoading = true;
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
        lat
      )}&lon=${encodeURIComponent(lng)}`;
      const res = await fetch(url, {
        headers: {
          // Nominatim usage policy prefers a UA; browsers may restrict custom UA headers.
          'Accept': 'application/json'
        }
      });
      if (!res.ok) return;
      const data = (await res.json()) as { display_name?: string; name?: string };
      const place = data.display_name ?? data.name ?? '';
      this.eventForm.patchValue({ locationName: place });
    } finally {
      this.reverseGeocodeLoading = false;
    }
  }

  private initMapIfNeeded(): void {
    if (this.map || !this.mapContainer) return;
    const type = this.eventForm.get('eventType')?.value;
    if (type !== 'REAL_LIFE') return;

    const el = this.mapContainer.nativeElement;
    this.map = L.map(el, { zoomControl: true }).setView([35.8256, 10.636], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      this.eventForm.patchValue({
        latitude: Number(lat.toFixed(6)),
        longitude: Number(lng.toFixed(6)),
        locationName: ''
      });

      if (!this.marker && this.map) {
        this.marker = L.circleMarker([lat, lng], {
          radius: 8,
          color: '#0D9488',
          weight: 3,
          fillColor: '#0D9488',
          fillOpacity: 0.25
        }).addTo(this.map);
      } else if (this.marker) {
        this.marker.setLatLng([lat, lng]);
      }

      void this.reverseGeocode(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    });

    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private destroyMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = undefined;
    this.marker = undefined;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const raw = this.eventForm.getRawValue() as {
        title: string;
        description: string;
        category: string;
        eventType: string;
        date: string;
        startTime: string;
        endTime: string;
        maxAttendees: number | null;
        imageUrl: string;
        meetingUrl: string;
        locationName: string;
        latitude: number | null;
        longitude: number | null;
      };

      const instructorIdRaw = this.authService.currentUserValue?.id;
      const instructorId = instructorIdRaw ? Number(instructorIdRaw) : undefined;

      const payload: BackendEventCreateRequest = {
        event_title: raw.title,
        session_description: raw.description,
        category: raw.category,
        event_type: raw.eventType as BackendEventType,
        event_date: raw.date,
        start_at: raw.startTime,
        ends_at: raw.endTime,
        max_attendees: raw.maxAttendees ?? undefined,
        instructor_id: Number.isFinite(instructorId as number) ? (instructorId as number) : undefined,
        image_url: raw.imageUrl?.trim().length ? raw.imageUrl.trim() : undefined,
        virtual_classroom: raw.eventType === 'LIVE_MEETING',
        meeting_link: raw.eventType === 'LIVE_MEETING' ? raw.meetingUrl : undefined,
        location_name: raw.eventType === 'REAL_LIFE' ? raw.locationName : undefined,
        latitude: raw.eventType === 'REAL_LIFE' ? raw.latitude ?? undefined : undefined,
        longitude: raw.eventType === 'REAL_LIFE' ? raw.longitude ?? undefined : undefined
      };

      const req$ = this.editingId
        ? this.eventService.updateBackendEvent(this.editingId, payload)
        : this.eventService.createBackendEvent(payload);

      req$
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            this.showSuccess = true;
            this.eventForm.reset();
            this.editingId = null;
            this.destroyMap();
            this.imagePreview = null;
          },
          error: (err) => {
            const msg = this.editingId ? 'Failed to update event' : 'Failed to create event';
            this.errorMessage = err?.error?.message ?? msg;
          }
        });
    }
  }

  private initEditModeIfNeeded(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) return;
    const id = Number(idParam);
    if (!Number.isFinite(id)) return;
    this.editingId = id;

    this.eventService.getBackendEventById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.event_title,
          description: event.session_description,
          category: event.category,
          eventType: event.event_type,
          date: event.event_date,
          startTime: (event.start_at ?? '').slice(0, 5),
          endTime: (event.ends_at ?? '').slice(0, 5),
          maxAttendees: event.max_attendees ?? null,
          imageUrl: event.image_url ?? '',
          meetingUrl: event.meeting_link ?? '',
          locationName: event.location_name ?? '',
          latitude: event.latitude ?? null,
          longitude: event.longitude ?? null
        });
        this.imagePreview = event.image_url ?? null;
        this.onEventTypeChanged();

        if (event.event_type === 'REAL_LIFE' && event.latitude != null && event.longitude != null) {
          setTimeout(() => {
            this.initMapIfNeeded();
            if (this.map) {
              const lat = event.latitude as number;
              const lng = event.longitude as number;
              this.map.setView([lat, lng], 14);
              if (!this.marker) {
                this.marker = L.circleMarker([lat, lng], {
                  radius: 8,
                  color: '#0D9488',
                  weight: 3,
                  fillColor: '#0D9488',
                  fillOpacity: 0.25
                }).addTo(this.map);
              } else {
                this.marker.setLatLng([lat, lng]);
              }
            }
          }, 0);
        }
      },
      error: () => {
        this.errorMessage = 'Failed to load event for editing';
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.eventForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Required field';
      if (control.errors['minlength']) return `Min ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['pattern']) {
        return 'Invalid URL format';
      }
    }
    return '';
  }

  goBack(): void {
    this.router.navigate(['/dashboard/instructor']);
  }
}
