import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course, CourseCategory, CourseLevel } from '../../../core/models/course.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { CourseService } from '../../../core/services/course.service';

@Component({
  selector: 'app-my-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      <!-- Header Section -->
      <section class="bg-white border-b border-gray-100 pt-16 pb-12">
        <div class="container mx-auto px-4 max-w-[1200px]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button routerLink="/dashboard/student" class="flex items-center gap-2 text-gray-400 hover:text-[#0D9488] font-bold text-sm mb-4 transition-colors group/back">
                <svg class="w-4 h-4 transition-transform group-hover/back:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
              </button>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Learning Path</span>
                <span class="text-gray-300">•</span>
                <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Courses</h1>
              </div>
              <p class="text-gray-500 font-medium">Track your progress and continue your learning journey</p>
            </div>
            <div class="flex items-center gap-4">
               <button routerLink="/courses" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">
                  Browse More Courses
               </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 max-w-[1200px] py-12">
        <!-- Search & Filter (Simplified) -->
        <div class="flex flex-col sm:flex-row gap-4 mb-10">
          <div class="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search your courses..." 
              class="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-gray-700 shadow-sm"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <select class="px-6 py-3.5 bg-white border border-gray-200 rounded-2xl text-gray-600 font-bold focus:ring-2 focus:ring-teal-500/20 outline-none shadow-sm cursor-pointer">
            <option>All Status</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        <!-- Courses Grid -->
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          @if (loading) {
            <div class="col-span-full flex justify-center py-16">
              <div class="w-10 h-10 border-2 border-teal-100 border-t-[#0D9488] rounded-full animate-spin"></div>
            </div>
          } @else {
          @for (course of myCourses; track course.id) {
            <div class="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
              <!-- Course Thumbnail -->
              <div class="relative h-48 overflow-hidden">
                <img 
                  [src]="(course.image && course.image.trim()) ? course.image : defaultCourseImage" 
                  [alt]="course.title"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div class="absolute bottom-4 left-4">
                   <span class="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                      {{ course.displayTag || course.category || 'Course' }}
                   </span>
                </div>
              </div>

              <!-- Course Content -->
              <div class="p-6 flex flex-col flex-grow">
                <h3 class="font-bold text-gray-900 text-lg mb-2 leading-tight group-hover:text-[#0D9488] transition-colors line-clamp-2">
                  {{ course.title }}
                </h3>
                <div class="flex items-center gap-2 mb-6 text-sm text-gray-500">
                   <span class="italic font-medium">By {{ course.instructor.name || 'Instructor' }}</span>
                </div>

                <!-- Progress Section -->
                <div class="mt-auto space-y-3">
                  <div class="flex items-center justify-between text-sm font-bold">
                    <span class="text-gray-400">Progress</span>
                    <span class="text-[#0D9488]">{{ course.progress ?? 0 }}%</span>
                  </div>
                  <div class="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-[#0D9488] rounded-full transition-all duration-700"
                      [style.width.%]="course.progress ?? 0"
                    ></div>
                  </div>
                  
                  <button 
                    [routerLink]="['/courses/course-flow']" [queryParams]="{ courseId: course.id }" 
                    class="w-full mt-4 py-3.5 bg-gray-50 text-gray-700 group-hover:bg-[#0D9488] group-hover:text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    Continue Learning
                    <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
          }
        </div>

        <!-- Pagination -->
        <div class="mt-20 flex justify-center items-center gap-4">
          <button class="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#0D9488] transition-all bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div class="flex items-center gap-2">
            <button class="w-12 h-12 rounded-2xl bg-[#0D9488] text-white font-black shadow-lg shadow-teal-100">1</button>
            <button class="w-12 h-12 rounded-2xl bg-white text-gray-400 font-black hover:bg-gray-50 border border-gray-100 shadow-sm transition-all">2</button>
            <button class="w-12 h-12 rounded-2xl bg-white text-gray-400 font-black hover:bg-gray-50 border border-gray-100 shadow-sm transition-all">3</button>
            <span class="text-gray-300 font-black mx-2">...</span>
            <button class="w-12 h-12 rounded-2xl bg-white text-gray-400 font-black hover:bg-gray-50 border border-gray-100 shadow-sm transition-all">8</button>
          </div>

          <button class="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-[#0D9488] transition-all bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

        @if (myCourses.length === 0) {
          <div class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
            <div class="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">No Courses Enrolled Yet</h3>
            <p class="text-gray-500 mb-8">Start your journey today by browsing our library.</p>
            <button routerLink="/courses" class="px-8 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">
              Discover Courses
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class MyCoursesComponent implements OnInit {
  readonly defaultCourseImage = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;
  myCourses: Course[] = [];
  loading = true;

  constructor(private readonly courseService: CourseService) {}

  ngOnInit(): void {
    this.courseService.getEnrolledCourses().subscribe({
      next: (courses) => {
        this.myCourses = courses || [];
        this.loading = false;
      },
      error: () => {
        this.myCourses = [];
        this.loading = false;
      }
    });
  }
}
