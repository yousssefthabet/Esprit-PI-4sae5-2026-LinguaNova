import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { CourseService } from '../../../core/services/course.service';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-instructor-courses',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      <!-- Header Section -->
      <section class="bg-white border-b border-gray-100 pt-16 pb-12">
        <div class="container mx-auto px-4 max-w-[1200px]">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <button routerLink="/dashboard/instructor" class="flex items-center gap-2 text-gray-400 hover:text-[#0D9488] font-bold text-sm mb-4 transition-colors group/back">
                <svg class="w-4 h-4 transition-transform group-hover/back:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
                Back to Dashboard
              </button>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Instructor Space</span>
                <span class="text-gray-300">•</span>
                <h1 class="text-3xl font-black text-gray-900 tracking-tight">My Published Courses</h1>
              </div>
              <p class="text-gray-500 font-medium">Manage and refine your educational curriculum</p>
            </div>
            <div class="flex items-center gap-4">
               <button routerLink="/courses/course-creation" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                  Create New Course
               </button>
            </div>
          </div>
        </div>
      </section>

      <div class="container mx-auto px-4 max-w-[1200px] py-12">
        <!-- Search & Filter Area -->
        <div class="flex flex-col lg:flex-row gap-6 mb-10">
          <div class="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search your courses by title or category..." 
              class="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-[20px] focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none text-gray-700 shadow-sm transition-all"
            >
            <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <div class="flex gap-4">
            <select class="px-6 py-4 bg-white border border-gray-100 rounded-[20px] text-gray-600 font-bold focus:ring-2 focus:ring-teal-500/20 outline-none shadow-sm cursor-pointer appearance-none min-w-[160px]">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>
            <select class="px-6 py-4 bg-white border border-gray-100 rounded-[20px] text-gray-600 font-bold focus:ring-2 focus:ring-teal-500/20 outline-none shadow-sm cursor-pointer appearance-none min-w-[160px]">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Most Students</option>
              <option>Highest Rated</option>
            </select>
          </div>
        </div>

        <!-- Courses List -->
        @if (loading) {
          <div class="flex flex-col items-center justify-center py-20">
            <div class="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gray-500 font-bold animate-pulse">Synchronizing your curriculum...</p>
          </div>
        } @else {
          <div class="grid gap-6">
            @for (course of instructorCourses; track course.id) {
              <!-- Course card content here (keep existing) -->
            <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div class="flex flex-col md:flex-row items-center gap-8">
                <!-- Course Thumbnail -->
                <div class="relative w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
                  <img [src]="course.image.trim() || defaultCourseImage" [alt]="course.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div class="absolute inset-0 bg-black/5"></div>
                </div>

                <!-- Course Info -->
                <div class="flex-1 text-center md:text-left">
                  <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 class="text-xl font-black text-gray-900 group-hover:text-[#0D9488] transition-colors mb-1">
                        {{ course.title }}
                      </h3>
                      <div class="flex items-center justify-center md:justify-start gap-4">
                        <span class="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md uppercase tracking-wider">{{ course.category }}</span>
                        <span [class]="'px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg ' + 
                          (course.isPublished ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-amber-50 text-amber-700 border border-amber-100')">
                          {{ course.isPublished ? 'Published' : 'Draft Mode' }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 py-4 border-t border-gray-50">
                    <div class="text-center md:text-left">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Students</p>
                      <p class="font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                        {{ course.studentsCount | number }}
                      </p>
                    </div>
                    <div class="text-center md:text-left">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Revenue</p>
                      <p class="font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                         \${{ (course.price * course.studentsCount) | number:'1.0-0' }}
                      </p>
                    </div>
                    <div class="text-center md:text-left">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rating</p>
                      <p class="font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                        <svg class="w-4 h-4 text-amber-500 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                        {{ course.rating }}
                      </p>
                    </div>
                    <div class="text-center md:text-left">
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Price</p>
                      <p class="font-bold text-gray-900 flex items-center justify-center md:justify-start gap-2">
                         \${{ course.price }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                  <button (click)="onUpdateCourse(course.id)" class="flex-1 md:w-32 py-3 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-[#0D9488] hover:text-white transition-all flex items-center justify-center gap-2 border border-gray-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                    Update
                  </button>
                  <button (click)="onDeleteCourse(course.id)" class="flex-1 md:w-32 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-100">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
              <div class="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">No Courses Created Yet</h3>
              <p class="text-gray-500 mb-8">Ready to share your knowledge with the world?</p>
              <button routerLink="/courses/course-creation" class="px-8 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">
                Create Your First Course
              </button>
            </div>
          }
        </div>
      }
    </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    select {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239CA3AF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 1.25rem center;
      background-size: 1.25rem;
    }
  `]
})
export class InstructorCoursesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  readonly defaultCourseImage = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;
  instructorCourses: Course[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.loading = true;
    this.courseService.getInstructorCourses().subscribe({
      next: (courses) => {
        this.instructorCourses = courses;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.loading = false;
      }
    });
  }

  onUpdateCourse(id: string): void {
    this.router.navigate(['/courses/edit', id]);
  }

  onDeleteCourse(id: string): void {
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          this.instructorCourses = this.instructorCourses.filter(c => c.id !== id);
          console.log('Course deleted:', id);
        },
        error: (err) => {
          console.error('Error deleting course:', err);
          // Fallback for demo if API fails
          this.instructorCourses = this.instructorCourses.filter(c => c.id !== id);
        }
      });
    }
  }
}
