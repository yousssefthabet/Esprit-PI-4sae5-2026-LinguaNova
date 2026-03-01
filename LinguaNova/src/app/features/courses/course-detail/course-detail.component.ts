import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (course) {
      <div class="bg-[#F8FAFC] min-h-screen font-sans">
        
        <!-- Header Banner (Clean & Light) -->
        <header class="bg-white border-b border-gray-100 pt-12 pb-12">
          <div class="container mx-auto px-4 max-w-[1200px]">
            <!-- Breadcrumbs -->
            <nav class="flex items-center gap-2 text-sm text-gray-500 font-medium mb-6">
              <a routerLink="/" class="hover:text-[#2D6F6B] transition-colors">Home</a>
              <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              <a routerLink="/courses" class="hover:text-[#2D6F6B] transition-colors">Courses</a>
              <svg class="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              <span class="text-[#2D6F6B]">{{ course.category }}</span>
            </nav>

            <div class="flex flex-col lg:flex-row gap-10 items-start">
               <!-- Main Header Info -->
               <div class="flex-1">
                  <h1 class="text-4xl lg:text-5xl font-extrabold text-[#2D3748] mb-6 leading-tight tracking-tight">
                    {{ course.title }}
                  </h1>
                  
                  <p class="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl">
                    {{ course.description }}
                  </p>

                  <div class="flex flex-wrap items-center gap-6 text-sm font-medium">
                    <div class="flex items-center gap-2 bg-[#FEF3C7] px-3 py-1 rounded-lg text-[#92400E]">
                      <span class="font-bold text-lg">{{ course.rating }}</span>
                      <div class="flex text-[#F59E0B]">
                        @for (star of [1,2,3,4,5]; track star) {
                          <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        }
                      </div>
                      <span class="text-[#92400E]/80">({{ course.reviewsCount }} reviews)</span>
                    </div>
                    
                    <div class="flex items-center gap-2 text-gray-500">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                      <span>{{ course.studentsCount }} students</span>
                    </div>
                    
                    <div class="flex items-center gap-2 text-gray-500">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      <span>Last updated {{ course.updatedAt | date:'MMMM yyyy' }}</span>
                    </div>

                    <div class="flex items-center gap-2 text-gray-500">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                      <span>{{ course.language }}</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </header>

        <!-- Main Content Grid -->
        <main class="container mx-auto px-4 max-w-[1200px] py-12 relative">
          <div class="flex flex-col lg:flex-row gap-12">
            
            <!-- Left Column: Details -->
            <div class="lg:w-[65%] space-y-12">
              
             

              <!-- Course Content (Accordion) -->
              <section class="bg-white rounded-[24px] p-8 md:p-10 border border-gray-100 shadow-sm">
                <div class="flex items-center justify-between mb-8">
                  <h2 class="text-2xl font-bold text-[#2D3748]">Course Content</h2>
                  <div class="text-sm text-gray-500 font-medium">
                    <span>{{ course.syllabus.length }} sections</span> • <span>{{ course.lessonsCount }} lectures</span> • <span>{{ course.duration }}h total</span>
                  </div>
                </div>

                <div class="space-y-4">
                  @for (section of course.syllabus; track section.id; let i = $index) {
                    <div class="border border-gray-100 rounded-xl overflow-hidden transition-all duration-300" [class.shadow-md]="openSections.has(i)">
                      <button 
                        (click)="toggleSection(i)"
                        class="w-full flex items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div class="flex items-center gap-4">
                          <div class="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-400 transition-transform duration-300" [class.rotate-180]="openSections.has(i)">
                             <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                          </div>
                          <span class="font-bold text-gray-800 text-lg">{{ section.title }}</span>
                        </div>
                        <span class="text-sm text-gray-500 font-medium whitespace-nowrap hidden sm:block">{{ section.lessons.length }} lectures • {{ section.duration }} min</span>
                      </button>
                      
                      @if (openSections.has(i)) {
                        <div class="bg-white px-5 py-2 divide-y divide-gray-50 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
                          @for (lesson of section.lessons; track lesson.id) {
                            <div class="flex items-center justify-between py-4 group cursor-pointer hover:pl-2 transition-all">
                              <div class="flex items-center gap-4">
                                <div class="w-8 h-8 flex items-center justify-center">
                                   <svg class="w-4 h-4 text-gray-400 group-hover:text-[#2D6F6B] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                   </svg>
                                </div>
                                <span class="text-gray-600 group-hover:text-[#2D6F6B] font-medium transition-colors">{{ lesson.title }}</span>
                              </div>
                              <div class="flex items-center gap-4">
                                @if (lesson.isPreview) {
                                  <span class="text-[#2D6F6B] font-bold text-xs uppercase tracking-wider">Preview</span>
                                }
                                <span class="text-xs text-gray-400 font-medium">{{ lesson.duration ?? '—' }} min</span>
                              </div>
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </section>

              <!-- Description -->
               <section class="bg-white rounded-[24px] p-8 md:p-10 border border-gray-100 shadow-sm">
                 <h2 class="text-2xl font-bold text-[#2D3748] mb-6">Description</h2>
                 <div class="prose prose-lg text-gray-600 max-w-none">
                    <p>{{ course.description }}</p>
                 </div>
               </section>

              <!-- Instructor -->
              <section class="bg-white rounded-[24px] p-8 md:p-10 border border-gray-100 shadow-sm">
                <h2 class="text-2xl font-bold text-[#2D3748] mb-8">Your Instructor</h2>
                <div class="flex flex-col sm:flex-row gap-8 items-start">
                  <div class="flex-shrink-0">
                     <img 
                      [src]="course.instructor.avatar || 'https://ui-avatars.com/api/?name=' + course.instructor.name + '&background=random'" 
                      [alt]="course.instructor.name"
                      class="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-sm"
                    />
                  </div>
                  <div>
                    <h3 class="text-xl font-bold text-[#2D3748] hover:text-[#2D6F6B] transition-colors cursor-pointer mb-1">{{ course.instructor.name }}</h3>
                    <p class="text-[#2D6F6B] font-medium mb-4">{{ course.instructor.title }}</p>
                    
                    <div class="flex gap-6 mb-6">
                       <div class="flex flex-col">
                          <span class="text-sm text-gray-400 font-medium uppercase tracking-wider">Rating</span>
                          <span class="font-bold text-gray-900 flex items-center gap-1">
                             <svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                             {{ course.instructor.rating }}
                          </span>
                       </div>
                       <div class="flex flex-col">
                          <span class="text-sm text-gray-400 font-medium uppercase tracking-wider">Students</span>
                          <span class="font-bold text-gray-900">{{ course.instructor.studentsCount }}</span>
                       </div>
                       <div class="flex flex-col">
                          <span class="text-sm text-gray-400 font-medium uppercase tracking-wider">Courses</span>
                          <span class="font-bold text-gray-900">{{ course.instructor.coursesCount }}</span>
                       </div>
                    </div>

                    <p class="text-gray-600 leading-relaxed">{{ course.instructor.bio }}</p>
                  </div>
                </div>
              </section>
            </div>

            <!-- Right Column: Sidebar (Sticky Enrollment) -->
            <div class="lg:w-[35%]">
              <div class="sticky top-28">
                <!-- Enrollment Card -->
                <div class="bg-white rounded-[24px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden relative">
                   <!-- Video Preview -->
                  <div class="relative group h-56 bg-gray-100 overflow-hidden cursor-pointer">
                    <img [src]="course.image.trim() || defaultCourseImage" [alt]="course.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <div class="w-16 h-16 bg-white/90 backdrop-blur rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                        <svg class="w-6 h-6 text-[#2D6F6B]" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div class="p-8">
                    <!-- Price -->
                    <div class="flex items-end gap-3 mb-8">
                      <span class="text-4xl font-extrabold text-[#2D3748] tracking-tight">$ {{ course.discountedPrice || course.price }}</span>
                      @if (course.discountedPrice) {
                        <span class="text-lg text-gray-400 line-through font-medium mb-1">$ {{ course.price }}</span>
                        <span class="px-2 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase rounded mb-1 ml-auto">{{ calculateDiscount() }}% OFF</span>
                      }
                    </div>

                    <!-- Actions -->
                    <div class="space-y-4 mb-8">
                       <button (click)="onEnroll()" class="w-full py-4 bg-[#0D9488] hover:bg-[#0D5E5B] text-white font-bold rounded-xl transition-all active:scale-[0.98]">
                          Enroll Now
                       </button>

                    </div>



                    <!-- Includes List -->
                    <div class="space-y-4 pt-8 border-t border-gray-100">
                       <p class="font-bold text-gray-900 mb-2">This course includes:</p>
                       <ul class="space-y-3">
                          
                          <li class="flex items-center gap-3 text-sm text-gray-600">
                             <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                             <span>Access on mobile and TV</span>
                          </li>
                          <li class="flex items-center gap-3 text-sm text-gray-600">
                             <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                             <span>{{ course.lessonsCount }} downloadable resources</span>
                          </li>
                          <li class="flex items-center gap-3 text-sm text-gray-600">
                             <svg class="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                             <span>Certificate of compliance</span>
                          </li>
                       </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    } @else if (loadError) {
      <div class="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] px-4">
        <div class="max-w-md text-center">
          <p class="text-gray-600 mb-6">We couldn't load this course. The backend may be unavailable or the course was not found.</p>
          <a routerLink="/courses" class="inline-flex items-center gap-2 px-6 py-3 bg-[#2D6F6B] text-white font-medium rounded-xl hover:bg-[#0D5E5B] transition-colors">
            Back to courses
          </a>
        </div>
      </div>
    } @else {
      <div class="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#2D6F6B]"></div>
      </div>
    }
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);

  readonly defaultCourseImage = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;
  course?: Course;
  loadError = false;
  openSections = new Set<number>([0]); // First section open by default

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (course) => { this.course = course; },
        error: () => { this.loadError = true; }
      });
    } else {
      this.loadError = true;
    }
  }

  toggleSection(index: number): void {
    if (this.openSections.has(index)) {
      this.openSections.delete(index);
    } else {
      this.openSections.add(index);
    }
  }

  calculateDiscount(): number {
    if (!this.course || !this.course.discountedPrice) return 0;
    return Math.round(((this.course.price - this.course.discountedPrice) / this.course.price) * 100);
  }

  onEnroll(): void {
    if (this.course) {
      this.router.navigate(['/checkout'], { queryParams: { courseId: this.course.id } });
    }
  }
}
