import { Component, ElementRef, inject, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseCategory, CourseLevel } from '../../../core/models/course.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';
import { CourseCardComponent } from '../../../shared/components/course-card/course-card.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, CourseCardComponent],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen py-12">
      <div class="container mx-auto px-4">
        <!-- Page Title -->
        <h1 class="text-[32px] font-bold text-[#2C3E50] mb-8">Search, learn & evolve</h1>

        <!-- Search Bar -->
        <div class="relative w-full mb-12">
          <input 
            type="text" 
            placeholder="What's on your mind"
            class="w-full pl-12 pr-6 py-4 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-[#2D8B7D]/20 focus:border-[#2D8B7D] outline-none text-base text-gray-700 h-[55px] placeholder-[#A0A0A0]"
          />
          <svg class="w-6 h-6 text-gray-400 absolute left-4 top-[15.5px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Left Sidebar - Filters Container -->
          <aside class="w-full lg:w-[320px] flex-shrink-0">
            <div class="bg-[#ECFBF9] rounded-2xl p-4 shadow-sm">
              <div class="space-y-8">
                <!-- Type Filter -->
                <div>
                  <div class="flex flex-col group">
                    <h3 class="font-semibold text-[#2D8B7D] text-lg mb-1">Academic Category</h3>
                    <div class="h-[1.5px] bg-[#2D8B7D] w-full mb-4"></div>
                  </div>
                  <div class="space-y-4">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" checked />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">All</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">English Language</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">General English</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">Business English</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">Academic English</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">English Communication</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">IELTS Preparation</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="radio" name="type" class="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-300 checked:border-[#1E293B] transition-all" />
                        <div class="absolute w-2.5 h-2.5 rounded-full bg-[#1E293B] opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      <span class="text-gray-800 font-medium">TOEFL Preparation</span>
                    </label>
                  </div>
                </div>

                <!-- Level Filter -->
                <div>
                  <div class="flex flex-col group">
                    <h3 class="font-semibold text-[#2D8B7D] text-lg mb-1">Skill Elevation</h3>
                    <div class="h-[1.5px] bg-[#2D8B7D] w-full mb-4"></div>
                  </div>
                  <div class="space-y-4">
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" checked />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Beginner</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Elementary</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Pre-Intermediate</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Intermediate</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Upper-Intermediate</span>
                    </label>
                    <label class="flex items-center gap-3 cursor-pointer group">
                      <div class="relative flex items-center justify-center">
                        <input type="checkbox" class="peer appearance-none w-5 h-5 rounded border-2 border-gray-300 checked:bg-[#4C1D95] checked:border-[#4C1D95] transition-all" />
                        <svg class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span class="text-gray-800 font-medium">Advanced</span>
                    </label>
                  </div>
                </div>

                <!-- Price Filter -->
                <div>
                  <div class="flex flex-col group">
                    <h3 class="font-semibold text-[#2D8B7D] text-lg mb-1">Price</h3>
                    <div class="h-[1.5px] bg-[#2D8B7D] w-full mb-6"></div>
                  </div>
                  <div class="px-2 select-none">
                    <div #priceTrack class="relative h-6 w-full flex items-center">
                      <!-- Track -->
                      <div class="absolute w-full h-1.5 bg-gray-300 rounded-full"></div>
                      <!-- Active Range -->
                      <div class="absolute h-1.5 bg-[#1E293B] rounded-full transition-[left,right] duration-75" [style.left.%]="minPercent" [style.right.%]="100 - maxPercent"></div>
                      <!-- Handle Left -->
                      <div class="absolute -translate-x-1/2 w-[18px] h-[18px] bg-[#1E293B] border-[3px] border-white rounded-full shadow-md cursor-grab active:cursor-grabbing" [style.left.%]="minPercent" (mousedown)="startPriceDrag($event, 'min')"></div>
                      <!-- Handle Right -->
                      <div class="absolute translate-x-1/2 w-[18px] h-[18px] bg-[#1E293B] border-[3px] border-white rounded-full shadow-md cursor-grab active:cursor-grabbing" [style.left.%]="maxPercent" (mousedown)="startPriceDrag($event, 'max')"></div>
                    </div>
                    <p class="text-sm text-gray-600 mt-2 font-medium">{{ priceMin }} – {{ priceMax }}</p>
                  </div>
                </div>

                <!-- Apply Button -->
                <button class="w-full mt-4 py-3.5 bg-[#2D6F6B] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1E4D4A] transition-all shadow-md active:scale-95">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Apply filters
                </button>
              </div>
            </div>
          </aside>

          <!-- Course Grid -->
          <main class="flex-1">
            <div class="grid md:grid-cols-2 gap-8">
              @for (course of filteredCourses; track course.id) {
                <app-course-card [course]="course" />
              }
            </div>

            <!-- Pagination -->
            <div class="mt-20 flex justify-center items-center gap-4">
              <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <div class="flex items-center gap-2">
                <button class="w-10 h-10 rounded-xl bg-[#2D6F6B] text-white font-bold shadow-sm">1</button>
                <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">2</button>
                <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">3</button>
                <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">4</button>
                <span class="text-gray-300 font-bold mx-1">...</span>
                <button class="w-10 h-10 rounded-xl bg-white text-gray-400 font-bold hover:bg-gray-50 border border-gray-100">7</button>
              </div>

              <button class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);

  @ViewChild('priceTrack') priceTrackRef?: ElementRef<HTMLElement>;

  priceMinLimit = 0;
  priceMaxLimit = 2500;
  priceMin = 0;
  priceMax = 2500;
  private priceDragging: 'min' | 'max' | null = null;

  get minPercent(): number {
    const range = this.priceMaxLimit - this.priceMinLimit;
    return range <= 0 ? 0 : ((this.priceMin - this.priceMinLimit) / range) * 100;
  }

  get maxPercent(): number {
    const range = this.priceMaxLimit - this.priceMinLimit;
    return range <= 0 ? 100 : ((this.priceMax - this.priceMinLimit) / range) * 100;
  }

  get filteredCourses(): Course[] {
    return this.demoCourses.filter((c) => {
      const effectivePrice = c.discountedPrice ?? c.price;
      return effectivePrice >= this.priceMin && effectivePrice <= this.priceMax;
    });
  }

  startPriceDrag(e: MouseEvent, which: 'min' | 'max'): void {
    e.preventDefault();
    this.priceDragging = which;
  }

  @HostListener('document:mousemove', ['$event'])
  onPriceDragMove(e: MouseEvent): void {
    if (this.priceDragging === null || !this.priceTrackRef?.nativeElement) return;
    const el = this.priceTrackRef.nativeElement;
    const rect = el.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const range = this.priceMaxLimit - this.priceMinLimit;
    const price = Math.round(this.priceMinLimit + (percent / 100) * range);
    if (this.priceDragging === 'min') {
      this.priceMin = Math.min(price, this.priceMax);
    } else {
      this.priceMax = Math.max(price, this.priceMin);
    }
  }

  @HostListener('document:mouseup')
  @HostListener('document:mouseleave')
  onPriceDragEnd(): void {
    this.priceDragging = null;
  }

  demoCourses: Course[] = [
    {
      id: '1',
      title: 'Speak Fluent English in 30 Days—No Boring Grammar Rules!',
      description: "Struggling to speak confidently? This course ditches complex grammar drills and focuses on real-world conversations. Learn the phrases, pronunciation hacks, and confidence tricks that native speak...",
      shortDescription: '',
      instructor: { id: 'inst1', name: 'John Doe', avatar: '', title: '', bio: '', coursesCount: 0, studentsCount: 0, rating: 0 },
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop',
      price: 350,
      priceSuffix: '/mo',
      displayTag: 'Blended learning',
      iconType: 'speech',
      category: CourseCategory.ENGLISH_LANGUAGE,
      level: CourseLevel.BEGINNER,
      duration: 30,
      lessonsCount: 20,
      studentsCount: 1200,
      rating: 4.8,
      reviewsCount: 150,
      language: 'English',
      subtitles: [],
      syllabus: [],
      requirements: [],
      learningOutcomes: [],
      tags: [],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'The Ultimate English Writing Masterclass: From Beginner to Pro!',
      description: "Want to write like a pro? Whether it's emails, essays, or creative stories, this course teaches you the secrets of powerful writing—structure, vocabulary, and style—so your words stand out every time!",
      shortDescription: '',
      instructor: { id: 'inst2', name: 'Jane Smith', avatar: '', title: '', bio: '', coursesCount: 0, studentsCount: 0, rating: 0 },
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop',
      price: 360,
      priceSuffix: '/mo',
      displayTag: 'Live classes',
      iconType: 'pencil',
      category: CourseCategory.GENERAL_ENGLISH,
      level: CourseLevel.INTERMEDIATE,
      duration: 40,
      lessonsCount: 25,
      studentsCount: 850,
      rating: 4.9,
      reviewsCount: 95,
      language: 'English',
      subtitles: [],
      syllabus: [],
      requirements: [],
      learningOutcomes: [],
      tags: [],
      isFeatured: false,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Accent Makeover: Sound Like a Native in Just Weeks!',
      description: "Tired of being misunderstood? Learn pronunciation hacks, rhythm, and intonation that will instantly improve your accent. Whether it's American, British, or neutral English, this course will help you speak...",
      shortDescription: '',
      instructor: { id: 'inst3', name: 'Mike Ross', avatar: '', title: '', bio: '', coursesCount: 0, studentsCount: 0, rating: 0 },
      image: 'https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&auto=format&fit=crop',
      price: 2000,
      discountedPrice: 1400,
      displayTag: 'Live classes',
      iconType: 'audio',
      category: CourseCategory.ENGLISH_COMMUNICATION,
      level: CourseLevel.ADVANCED,
      duration: 50,
      lessonsCount: 30,
      studentsCount: 500,
      rating: 4.7,
      reviewsCount: 60,
      language: 'English',
      subtitles: [],
      syllabus: [],
      requirements: [],
      learningOutcomes: [],
      tags: [],
      isFeatured: false,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      title: 'Master English for Work: Speak, Write & Impress Like a Pro!',
      description: "Want to ace interviews, meetings, and emails in English? This course gives you business communication skills to sound professional and confident—so you can land jobs, close deals, and sta...",
      shortDescription: '',
      instructor: { id: 'inst4', name: 'Sarah Harvey', avatar: '', title: '', bio: '', coursesCount: 0, studentsCount: 0, rating: 0 },
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop',
      price: 450,
      priceSuffix: '/mo',
      displayTag: 'Blended learning',
      iconType: 'briefcase',
      category: CourseCategory.BUSINESS_ENGLISH,
      level: CourseLevel.UPPER_INTERMEDIATE,
      duration: 60,
      lessonsCount: 35,
      studentsCount: 2000,
      rating: 4.9,
      reviewsCount: 300,
      language: 'English',
      subtitles: [],
      syllabus: [],
      requirements: [],
      learningOutcomes: [],
      tags: [],
      isFeatured: true,
      isPublished: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  ngOnInit(): void {
    this.courseService.getCourses({ page: 1, limit: 20 }).subscribe({
      next: (res) => {
        if (res.items && res.items.length > 0) {
          this.demoCourses = res.items.map((c: Course) => ({
            ...c,
            image: (c.image && String(c.image).trim()) ? String(c.image).trim() : APP_CONSTANTS.DEFAULT_COURSE_IMAGE
          }));
        }
        // else keep the hardcoded demo data as fallback
      },
      error: (err) => {
        console.warn('Backend not reachable, using demo data.', err);
      }
    });
  }
}
