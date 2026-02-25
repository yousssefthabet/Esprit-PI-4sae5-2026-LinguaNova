import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { StudentStats, RecentActivity, ClassSchedule } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      
      <!-- Premium Welcome Header -->
      <section class="relative bg-white pt-16 pb-12 overflow-hidden border-b border-gray-100">
        <!-- Ambient Background Element -->
        <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-50/50 to-transparent pointer-events-none"></div>
        <div class="absolute -top-24 -right-24 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-50"></div>

        <div class="container mx-auto px-4 max-w-[1200px] relative z-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                 <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Student Space</span>
                 <span class="text-gray-300">•</span>
                 <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Dashboard Overview</span>
              </div>

            </div>
            <div class="flex items-center gap-4">
               <button routerLink="/calendar" class="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                  Calendar
               </button>
               <button routerLink="/courses" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-[0.98]">
                  Browse Courses
               </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 max-w-[1200px] py-12">
        
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          @if (stats) {
            <!-- Courses Enrolled -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <span class="text-xs font-black text-gray-300 uppercase tracking-widest">Active</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Enrolled</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.enrolledCourses }}</h3>
            </div>

            <!-- Completed -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span class="text-xs font-black text-gray-300 uppercase tracking-widest">Success</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Completed</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.completedCourses }}</h3>
            </div>

            <!-- Learning Time -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span class="text-xs font-black text-gray-300 uppercase tracking-widest">Hours</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Study Time</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.totalLearningTime }}h</h3>
            </div>

            <!-- Certificates -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <span class="text-xs font-black text-gray-300 uppercase tracking-widest">Rewards</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Certificates</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.certificatesEarned }}</h3>
            </div>
          }
        </div>

        <div class="grid lg:grid-cols-12 gap-10">
          
          <!-- Your Next Classes (Left 8 cols) -->
          <div class="lg:col-span-8">
            <div class="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
              <div class="flex items-center justify-between mb-8">
                 <div>
                    <h2 class="text-2xl font-black text-gray-900 tracking-tight">Your  Classes</h2>
                    
                 </div>
                 <a routerLink="/courses/my-courses" class="text-[#0D9488] font-bold text-sm hover:underline">View All classes</a>
              </div>

              <div class="space-y-6">
                @for (cls of upcomingClasses; track cls.id) {
                  <div class="bg-white rounded-[24px] p-6 shadow-sm shadow-teal-900/5 relative group transition-all hover:shadow-md border border-gray-100 hover:border-teal-100">
                    
                  

                    <div class="flex flex-col md:flex-row items-center gap-6">
                      <!-- Date Badge (Left) -->
                      <div class="w-16 h-20 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-100 transition-colors group-hover:bg-teal-50 group-hover:border-teal-100">
                        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ cls.startTime | date:'MMM' }}</span>
                        <span class="text-2xl font-black text-gray-900">{{ cls.startTime | date:'dd' }}</span>
                      </div>

                      <!-- Content (Middle) -->
                      <div class="flex-grow space-y-3">
                        <div>
                          <h3 class="font-bold text-gray-900 text-lg tracking-tight group-hover:text-[#0D9488] transition-colors leading-tight">
                            {{ cls.courseName }}
                          </h3>
                        </div>
                        
                        <div class="flex items-center justify-between">
                          <div class="space-y-1">
                            <div class="flex items-center gap-4 text-sm font-medium">
                              <span class="text-gray-400 italic">By {{ cls.instructorName }}</span>
                              <span class="text-[#0D9488] font-bold">{{ cls.startTime | date:'HH:mm' }} - {{ cls.endTime | date:'HH:mm' }}</span>
                            </div>
                          </div>
                        </div>

                        <!-- Progress Section -->
                        <div class="flex items-center gap-4 mt-2">
                          <div class="flex-grow h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full bg-[#0D9488] rounded-full transition-all duration-500" [style.width.%]="cls.progress || 0"></div>
                          </div>
                          @if (cls.currentLesson) {
                            <span class="text-[11px] font-bold text-gray-400 whitespace-nowrap">{{ cls.currentLesson }}</span>
                          }
                        </div>
                      </div>

                      <!-- Action Button (Right) -->
                      <div class="flex-shrink-0 w-full md:w-auto">
                        <button class="w-full md:w-auto px-8 py-3 bg-[#0D9488] text-white font-black text-sm rounded-2xl shadow-lg shadow-teal-100 hover:bg-[#09776d] transition-all active:scale-95">
                          {{ cls.status === 'live' ? 'Join Classroom' : 'Join classrom' }}
                        </button>
                      </div>

                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Recent Activity Feed (Right 4 cols) -->
          <div class="lg:col-span-4 space-y-8">
            <div>
               <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Activities</h2>
               <p class="text-gray-400 text-sm font-medium">Your recent learning milestones</p>
            </div>

            <div class="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <!-- Decorative element -->
               <div class="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-[100%] pointer-events-none"></div>

               <div class="space-y-8 relative">
                 <!-- The dotted vertical line -->
                 <div class="absolute left-3 top-2 bottom-2 w-0.5 border-l-2 border-dotted border-gray-100"></div>

                 @for (activity of activities; track activity.id) {
                   <div class="relative pl-10 group/item">
                     <!-- Dot -->
                     <div class="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center -translate-x-1.5 transition-transform group-hover/item:scale-125"
                        [class.bg-teal-500]="activity.type === 'lesson_completed'" 
                        [class.bg-blue-500]="activity.type === 'course_completed'" 
                        [class.bg-amber-500]="activity.type === 'certificate_earned'">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                     </div>

                     <div>
                       <h4 class="text-sm font-bold text-gray-800 leading-tight group-hover/item:text-[#0D9488] transition-colors">{{ activity.description }}</h4>
                       <p class="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest">{{ activity.timestamp | date:'shortTime' }} • {{ activity.type.replace('_', ' ') }}</p>
                     </div>
                   </div>
                 }
               </div>

               <button class="w-full mt-10 py-3 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">
                  View Full History
               </button>
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
export class StudentDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);

  stats?: StudentStats;
  activities: RecentActivity[] = [];
  upcomingClasses: ClassSchedule[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.loading = true;

    // Load student stats
    this.dashboardService.getStudentStats().subscribe(stats => {
      this.stats = stats;
    });

    // Load activities
    this.dashboardService.getRecentActivity().subscribe(activities => {
      this.activities = activities;
    });

    // Load upcoming classes
    this.dashboardService.getUpcomingClasses().subscribe(classes => {
      this.upcomingClasses = classes;
      this.loading = false;
    });
  }
}
