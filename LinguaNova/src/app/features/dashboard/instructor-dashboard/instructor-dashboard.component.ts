import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { InstructorStats, RecentActivity } from '../../../core/models/dashboard.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-instructor-dashboard',
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
                 <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Instructor Space</span>
                 <span class="text-gray-300">•</span>
                 <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Teacher Dashboard</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
               <button [routerLink]="['/event/create']" class="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  Live Event
               </button>
               <button [routerLink]="['/courses/course-creation']" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-[0.98] flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  New Course
               </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 max-w-[1200px] py-12">
        
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          @if (stats) {
            <!-- Total Revenue -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <span class="text-xs font-black text-green-500 uppercase tracking-widest">+15%</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
               <h3 class="text-3xl font-black text-gray-900">\${{ stats.totalEarnings | number:'1.2-2' }}</h3>
            </div>

            <!-- Total Students -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <span class="text-xs font-black text-blue-500 uppercase tracking-widest">+840</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Students</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.totalStudents | number }}</h3>
            </div>

            <!-- Active Courses -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                  </div>
                  <span class="text-xs font-black text-amber-500 uppercase tracking-widest">+2</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active Courses</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.activeCourses }}</h3>
            </div>

            <!-- Avg Rating -->
            <div class="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
               <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <span class="text-xs font-black text-purple-500 uppercase tracking-widest">Top 5%</span>
               </div>
               <p class="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Avg. Rating</p>
               <h3 class="text-3xl font-black text-gray-900">{{ stats.averageRating }}</h3>
            </div>
          }
        </div>

        <div class="grid lg:grid-cols-12 gap-10">
          
          <!-- My Courses (Left 8 cols) -->
          <div class="lg:col-span-8 space-y-8">
            <div class="flex items-center justify-between mb-2">
               <div>
                  <h2 class="text-2xl font-black text-gray-900 tracking-tight">Academic Projects</h2>
                  <p class="text-gray-400 text-sm font-medium">Manage your educational curriculum</p>
               </div>
               <button routerLink="/courses/instructor-courses" class="text-[#0D9488] font-bold text-sm hover:underline">View All Courses</button>
            </div>

            <div class="space-y-4">
              @for (course of courses; track course.id) {
                <div class="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-100 transition-all group overflow-hidden">
                  <div class="flex flex-col sm:flex-row items-center gap-6">
                    <img [src]="course.image.trim() || defaultCourseImage" [alt]="course.title" class="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    
                    <div class="flex-1 text-center sm:text-left">
                      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
                        <h3 class="font-bold text-gray-900 group-hover:text-[#0D9488] transition-colors text-xl tracking-tight">
                          {{ course.title }}
                        </h3>
                        <span [class]="'px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ' + 
                          (course.isPublished ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100')">
                          {{ course.isPublished ? 'Published' : 'Draft Mode' }}
                        </span>
                      </div>
                      
                      <div class="flex items-center justify-center sm:justify-start gap-6 text-sm font-medium text-gray-500">
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg> 
                          {{ course.studentsCount | number }} Students
                        </span>
                        <span class="flex items-center gap-2">
                          <svg class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> 
                          \${{ course.price * course.studentsCount | number:'1.0-0' }}
                        </span>
                        <span class="flex items-center gap-2 text-amber-500">
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg> 
                          {{ course.rating }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button (click)="$event.stopPropagation()" class="p-2 text-gray-400 hover:text-[#0D9488] transition-colors" title="Update Course">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button (click)="$event.stopPropagation()" class="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete Course">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Activity Feed (Right 4 cols) -->
          <div class="lg:col-span-4 space-y-8">
            <div>
               <h2 class="text-2xl font-black text-gray-900 tracking-tight mb-2">Student Intake</h2>
               <p class="text-gray-400 text-sm font-medium">Recent classroom interactions</p>
            </div>

            <div class="bg-white rounded-[24px] p-8 border border-gray-100 shadow-sm relative overflow-hidden">
               <!-- Decorative element -->
               <div class="absolute top-0 right-0 w-24 h-24 bg-teal-50/50 rounded-bl-[100%] pointer-events-none"></div>

               <div class="space-y-8 relative">
                 <!-- The vertical line -->
                 <div class="absolute left-3 top-2 bottom-2 w-0.5 border-l-2 border-dotted border-gray-100"></div>

                 @for (activity of activities; track activity.id) {
                   <div class="relative pl-10 group/item">
                     <!-- Dot -->
                     <div class="absolute left-0 top-1 w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center -translate-x-1.5 transition-transform group-hover/item:scale-125 bg-teal-500">
                        <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                     </div>

                     <div>
                       <h4 class="text-sm font-bold text-gray-800 leading-tight group-hover/item:text-[#0D9488] transition-colors">
                          <span class="text-[#0D9488]">{{ activity.username }}</span> {{ activity.description }}
                       </h4>
                       <p class="text-[10px] text-gray-400 mt-1 font-black uppercase tracking-widest">{{ activity.timestamp | date:'shortTime' }} • {{ activity.type.replace('_', ' ') }}</p>
                     </div>
                   </div>
                 }
               </div>

               <button class="w-full mt-10 py-3 bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-colors">
                  Full History
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
export class InstructorDashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AuthService);

  readonly defaultCourseImage = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;
  stats?: InstructorStats;
  activities: (RecentActivity & { username?: string })[] = [];
  courses: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadInstructorCourses();
  }

  private loadInstructorCourses(): void {
    this.courses = [
      {
        id: '1',
        title: 'Full-Stack Web Development',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
        studentsCount: 1240,
        price: 99.99,
        rating: 4.9,
        isPublished: true
      },
      {
        id: '2',
        title: 'Advanced English Masterclass',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        studentsCount: 3421,
        price: 149.99,
        rating: 4.8,
        isPublished: true
      },
      {
        id: '3',
        title: 'UI/UX Design Masterclass',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
        studentsCount: 850,
        price: 79.99,
        rating: 4.7,
        isPublished: false
      }
    ];
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.dashboardService.getInstructorStats().subscribe(stats => {
      this.stats = stats;
    });

    this.dashboardService.getRecentActivity().subscribe(activities => {
      const usernames = ['Alice Spencer', 'Bob Miller', 'Charlie Davis', 'Diana Prince'];
      this.activities = activities.map((a, i) => ({
        ...a,
        username: usernames[i % usernames.length]
      }));
      this.loading = false;
    });
  }
}
