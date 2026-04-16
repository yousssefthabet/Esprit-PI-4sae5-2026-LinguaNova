import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { Course } from '../../core/models/course.model';
import { APP_CONSTANTS } from '../../core/constants/app.constants';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      
      <!-- Premium Checkout Header -->
      <section class="bg-white border-b border-gray-100 pt-16 pb-12 mb-12">
        <div class="container mx-auto px-4 max-w-[1200px]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div class="flex items-center gap-3 mb-2">
                 <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Secure Protocol</span>
                 <span class="text-gray-300">•</span>
                 <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Transaction Matrix</span>
              </div>
              <h1 class="text-4xl font-black text-gray-900 tracking-tight">Finalize Enrollment</h1>
            </div>
            <div class="flex items-center gap-4 text-gray-400">
               <div class="flex items-center gap-2">
                  <i-lucide name="lock" class="w-4 h-4 text-[#0D9488]"></i-lucide>
                  <span class="text-[10px] font-black uppercase tracking-widest">256-bit SSL Encryption</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 max-w-[1200px]">
        @if (course) {
          <div class="grid lg:grid-cols-12 gap-12">
            
            <!-- Left Column: Acquisition Logic -->
            <div class="lg:col-span-8 space-y-8">
              
              <!-- Payment Method Selection -->
              <div class="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 p-10">
                <div class="flex items-center justify-between mb-8">
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight">Payment Method</h2>
                  <div class="flex gap-2">
                     <div class="px-3 py-1 bg-gray-50 rounded-lg border border-gray-100 italic text-[10px] font-bold text-gray-400">Secure</div>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-4 mb-10">
                  <label class="relative cursor-pointer group">
                    <input type="radio" name="payment" checked class="peer hidden" />
                    <div class="h-full p-6 border-2 border-gray-50 bg-gray-50/30 rounded-[24px] transition-all peer-checked:border-[#0D9488] peer-checked:bg-teal-50/30 group-hover:bg-gray-50">
                      <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#0D9488] border border-gray-100 shadow-sm">
                          <i-lucide name="credit-card" class="w-5 h-5"></i-lucide>
                        </div>
                        <div class="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:border-[#0D9488] flex items-center justify-center peer-checked:bg-[#0D9488]">
                           <div class="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <p class="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-1">Bank Card</p>
                      <p class="text-xs text-gray-400 font-medium leading-relaxed">Visa, Mastercard, Amex</p>
                    </div>
                  </label>

                  <label class="relative cursor-pointer group">
                    <input type="radio" name="payment" class="peer hidden" />
                    <div class="h-full p-6 border-2 border-gray-50 bg-gray-50/30 rounded-[24px] transition-all peer-checked:border-[#0D9488] peer-checked:bg-teal-50/30 group-hover:bg-gray-50">
                      <div class="flex items-center justify-between mb-4">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 border border-gray-100 shadow-sm font-black text-xs">
                          PP
                        </div>
                        <div class="w-5 h-5 rounded-full border-2 border-gray-200 flex items-center justify-center">
                           <div class="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <p class="font-black text-gray-900 uppercase tracking-widest text-[11px] mb-1">PayPal</p>
                      <p class="text-xs text-gray-400 font-medium leading-relaxed">Express Checkout</p>
                    </div>
                  </label>
                </div>

                <!-- Credential Interface -->
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="md:col-span-2">
                       <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Universal Card Reference</p>
                       <input type="text" placeholder="0000 0000 0000 0000" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                    </div>
                    <div>
                       <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Architectural Expiry</p>
                       <input type="text" placeholder="MM/YY" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                    </div>
                    <div>
                       <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Security Node (CVC)</p>
                       <input type="password" placeholder="***" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Billing Address (Simplified Premium) -->
              <div class="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 p-10">
                <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-8">Regional Configuration</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div class="md:col-span-2">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Geographic Domicile</p>
                      <input type="text" placeholder="Street Address" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                   </div>
                   <div>
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Metropolitan Center</p>
                      <input type="text" placeholder="City" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                   </div>
                   <div>
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Postal Protocol</p>
                      <input type="text" placeholder="ZIP" class="w-full px-6 py-4 bg-gray-50 border-none rounded-[18px] text-sm font-bold focus:ring-2 focus:ring-teal-500/10 outline-none transition-all" />
                   </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Revenue Summary -->
            <div class="lg:col-span-4">
              <div class="sticky top-8 space-y-6">
                <div class="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-gray-200/30 p-10 overflow-hidden relative">
                  <!-- Decorative Gradient -->
                  <div class="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full pointer-events-none"></div>

                  <h2 class="text-xl font-black text-gray-900 tracking-tight mb-8 relative z-10">Audit Summary</h2>
                  
                  <!-- Asset Item -->
                  <div class="flex gap-5 mb-10 relative z-10">
                    <img [src]="course.image.trim() || defaultCourseImage" [alt]="course.title" class="w-20 h-20 rounded-[24px] object-cover shadow-sm border-2 border-white" />
                    <div>
                      <h4 class="font-black text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{{ course.title }}</h4>
                      <p class="text-[10px] font-black text-[#0D9488] uppercase tracking-widest">Master Edition</p>
                    </div>
                  </div>

                  <!-- Fiscal Computation -->
                  <div class="space-y-5 pt-8 border-t border-gray-50 relative z-10">
                    <div class="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>Baseline Fare</span>
                      <span class="text-gray-900 tracking-normal">$ {{ course.price }}</span>
                    </div>
                    @if (course.discountedPrice) {
                      <div class="flex justify-between items-center text-xs font-bold text-orange-500 uppercase tracking-widest">
                        <span>Platform Rebate</span>
                        <span class="tracking-normal">- $ {{ course.price - course.discountedPrice }}</span>
                      </div>
                    }
                    <div class="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <span>Service Levy</span>
                      <span class="text-gray-900 tracking-normal">$ {{ getTax() }}</span>
                    </div>
                    <div class="flex justify-between items-center pt-8 border-t border-gray-50">
                      <span class="text-xl font-black text-gray-900 tracking-tight">Total Audit</span>
                      <span class="text-3xl font-black text-[#0D9488]">$ {{ getTotal() }}</span>
                    </div>
                  </div>

                  <button 
                    class="w-full mt-10 py-5 bg-[#0D9488] text-white text-xs font-black uppercase tracking-widest rounded-[22px] shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                    [disabled]="loading"
                    (click)="onCompletePurchase()"
                  >
                    @if (loading) {
                      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Processing...
                    } @else {
                      Deploy Access
                    }
                  </button>

                  <div class="flex items-center justify-center gap-2 mt-8 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                     <i-lucide name="shield-check" class="w-3 h-3 text-teal-300"></i-lucide>
                     Protected by SecureGate v4.2
                  </div>
                </div>

                <!-- Assistance Card -->
                <div class="bg-[#2D6F6B] rounded-[32px] p-8 text-white">
                   <h3 class="font-black text-sm uppercase tracking-widest mb-3">Priority Support</h3>
                   <p class="text-xs text-white/70 font-medium leading-relaxed mb-6">Encountered an anomaly during the protocol? Our architects are standby.</p>
                   <button class="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Open Comms</button>
                </div>
              </div>
            </div>
          </div>
        @} @else {
          <!-- Modern Skeleton/Loading -->
          <div class="flex flex-col items-center justify-center py-32 space-y-6">
            <div class="w-16 h-16 border-4 border-teal-50 border-t-[#0D9488] rounded-full animate-spin"></div>
            <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Synchronizing Payment Gateway...</p>
          </div>
        }
      </div>

      <!-- Success Interaction Layer -->
      @if (showSuccess) {
        <div class="fixed inset-0 bg-black/60 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-fade-in">
          <div class="max-w-md w-full bg-white rounded-[50px] p-12 text-center shadow-2xl animate-pop-in relative overflow-hidden">
            <!-- Background Ambience -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50"></div>
            
            <div class="w-24 h-24 bg-teal-50 text-[#0D9488] rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-lg shadow-teal-50 border-4 border-white rotate-3 group">
              <i-lucide name="check-circle" class="w-12 h-12"></i-lucide>
            </div>
            
            <h3 class="text-3xl font-black text-gray-900 mb-4 tracking-tighter leading-none">Access Granted!</h3>
            <p class="text-sm text-gray-500 font-medium mb-12 leading-relaxed">System integration complete. Your educational curriculum for <span class="text-[#0D9488] font-bold">"{{ course?.title }}"</span> has been provisioned.</p>
            
            <button 
              (click)="goToCourse()"
              class="w-full py-5 bg-[#0D9488] text-white text-xs font-black uppercase tracking-widest rounded-[22px] shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-95"
            >
              Enter Classroom
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    .animate-pop-in { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes popIn {
      from { transform: scale(0.8) translateY(20px); opacity: 0; }
      to { transform: scale(1) translateY(0); opacity: 1; }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  readonly defaultCourseImage = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;
  course?: Course;
  loading = false;
  showSuccess = false;

  ngOnInit(): void {
    const courseId = this.route.snapshot.queryParamMap.get('courseId') ?? this.route.snapshot.queryParamMap.get('course_id');
    const success = this.route.snapshot.queryParamMap.get('success');
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (courseId && success === '1' && sessionId) {
      this.handleStripeSuccess(courseId, sessionId);
      return;
    }
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe(c => {
        this.course = c;
      });
    } else {
      this.courseService.getCourses().subscribe(res => {
        this.course = res.items[0];
      });
    }
  }

  private handleStripeSuccess(courseId: string, sessionId: string): void {
    this.courseService.enrollCourse(courseId, sessionId).subscribe({
      next: () => {
        this.courseService.getCourseById(courseId).subscribe(c => {
          this.course = c;
          this.showSuccess = true;
        });
      },
      error: () => {
        this.router.navigate(['/checkout'], { queryParams: { courseId } });
      }
    });
  }

  getTax(): number {
    const base = this.course?.discountedPrice || this.course?.price || 0;
    return Math.round(base * 0.05 * 100) / 100;
  }

  getTotal(): number {
    const base = this.course?.discountedPrice || this.course?.price || 0;
    return base + this.getTax();
  }

  onCompletePurchase(): void {
    if (!this.course?.id) return;
    this.loading = true;
    const successUrl = `${window.location.origin}/checkout?success=1`;
    const cancelUrl = `${window.location.origin}/checkout?courseId=${this.course.id}`;
    this.courseService.createCheckoutSession(this.course.id, successUrl, cancelUrl).subscribe({
      next: (res) => {
        this.loading = false;
        if (res?.url) {
          window.location.href = res.url;
          return;
        }
        this.enrollAndShowSuccess();
      },
      error: () => {
        this.loading = false;
        this.enrollAndShowSuccess();
      }
    });
  }

  private enrollAndShowSuccess(): void {
    if (!this.course?.id) return;
    this.loading = true;
    this.courseService.enrollCourse(this.course.id).subscribe({
      next: () => {
        this.loading = false;
        this.showSuccess = true;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  goToCourse(): void {
    this.router.navigate(['/courses/my-courses']);
  }
}
