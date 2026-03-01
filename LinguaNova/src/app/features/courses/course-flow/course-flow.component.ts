import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseLesson, CourseQuiz } from '../../../core/models/course.model';

const LESSON_COLORS = ['#2BBCB0', '#E67E22', '#2C3E50', '#E87B7B'] as const;

@Component({
    selector: 'app-course-flow',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="flex min-h-screen bg-[#F4F6F8]">
      @if (loading) {
        <div class="flex-1 flex items-center justify-center">
          <div class="w-10 h-10 border-2 border-[#2BBCB0] border-t-transparent rounded-full animate-spin"></div>
        </div>
      } @else if (errorMessage) {
        <div class="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <p class="text-gray-600">{{ errorMessage }}</p>
          <a [routerLink]="['/courses/my-courses']" class="px-6 py-3 bg-[#2BBCB0] text-white rounded-xl font-medium hover:opacity-90">Back to My Courses</a>
        </div>
      } @else if (course) {
      <!-- Left Sidebar -->
      <aside class="w-[215px] shrink-0 bg-white flex flex-col border-r border-gray-100 ml-10 rounded-xl ">
        <div class="p-4">
          <a [routerLink]="['/courses/my-courses']" class="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#2BBCB0] text-white hover:opacity-90 transition-opacity" aria-label="Back">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
          </a>
        </div>
        @for (section of course.syllabus; track section.id) {
          <div class="px-4 pb-2">
            <h2 class="text-[#333] font-bold text-sm">{{ section.title || 'Module' }}</h2>
          </div>
          <nav class="px-3 space-y-1.5">
            @for (lesson of section.lessons; track lesson.id; let i = $index) {
              <button type="button" (click)="selectLesson(lesson)"
                class="w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition-opacity hover:opacity-90"
                [style.background]="LESSON_COLORS[i % LESSON_COLORS.length]"
                [class.ring-2]="selectedLessonId === lesson.id"
                [class.ring-[#2BBCB0]]="selectedLessonId === lesson.id">
                <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </span>
                <span class="text-white text-xs font-medium flex-1 min-w-0">{{ lesson.title }}</span>
                <span class="text-white/90 text-xs font-medium shrink-0">{{ lesson.duration ?? '—' }} mins</span>
              </button>
            }
          </nav>
        }
        @if (course.quizzes?.length) {
          <div class="px-4 pt-6 pb-3">
            <h2 class="text-[#333] font-bold text-xs uppercase tracking-wide">Practice Quiz</h2>
          </div>
          <nav class="px-3 space-y-1.5 flex-1 overflow-auto">
            @for (quiz of course.quizzes; track quiz.id; let i = $index) {
              <button type="button" (click)="selectQuiz(quiz)"
                class="w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition-opacity hover:opacity-90"
                [style.background]="LESSON_COLORS[i % LESSON_COLORS.length]"
                [class.ring-2]="selectedQuizId === quiz.id"
                [class.ring-[#2BBCB0]]="selectedQuizId === quiz.id">
                <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                  <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </span>
                <span class="text-white text-xs font-medium flex-1 min-w-0">{{ quiz.title }}</span>
                <span class="text-white/90 text-xs font-medium shrink-0">{{ quiz.questions?.length ?? 0 }} Q</span>
              </button>
            }
          </nav>
        }
      </aside>

      <!-- Right Main Content -->
      <main class="flex-1 min-w-0 flex flex-col">
       

        <div class="flex-1 p-8">
          @if (selectedLesson) {
            <div class="max-w-4xl bg-white rounded-2xl shadow-sm p-8 min-h-[400px] flex flex-col">
              <h3 class="text-[#2BBCB0] font-bold text-lg mb-2">{{ selectedLesson.title }}</h3>
              <p class="text-[#333] text-sm text-gray-500 mb-6">
                {{ selectedLesson.type === 'video' ? 'Video lesson' : selectedLesson.type === 'reading' ? 'Reading material' : 'Lesson content' }}.
                @if (selectedLesson.duration) {
                  <span>{{ selectedLesson.duration }} minutes</span>
                }
              </p>
              <p class="text-gray-600 text-sm">Content for this lesson will load here (video player or PDF viewer).</p>
              <div class="flex-1"></div>
            </div>
          } @else if (selectedQuizItem) {
            <div class="max-w-4xl bg-white rounded-2xl shadow-sm p-8 min-h-[400px] flex flex-col">
              <h3 class="text-[#2BBCB0] font-bold text-lg mb-2">{{ selectedQuizItem.title }}</h3>
              <p class="text-[#333] text-sm text-gray-500 mb-4">Passing score: {{ selectedQuizItem.passingScore ?? 70 }}%</p>
              <p class="text-gray-600 text-sm mb-6">{{ selectedQuizItem.questions?.length ?? 0 }} questions</p>
              <div class="space-y-4">
                @for (q of selectedQuizItem.questions; track q.id; let i = $index) {
                  <div class="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <p class="font-medium text-gray-900 mb-2">{{ i + 1 }}. {{ q.text }}</p>
                    <ul class="list-disc list-inside text-sm text-gray-600">
                      @for (opt of q.options; track opt) {
                        <li>{{ opt }}</li>
                      }
                    </ul>
                  </div>
                }
              </div>
              <div class="mt-8 flex justify-end">
                <button type="button" class="px-6 py-3 bg-[#2BBCB0] text-white font-medium rounded-xl hover:opacity-90">Submit Quiz</button>
              </div>
            </div>
          } @else {
            <div class="max-w-4xl bg-white rounded-2xl shadow-sm p-8 min-h-[400px] flex flex-col">
              <h3 class="text-[#2BBCB0] font-bold text-lg mb-2">Course content</h3>
              <p class="text-[#333] text-sm text-gray-500 mb-6">{{ course.description }}</p>
              <p class="text-gray-500 text-sm">Select a lesson or quiz from the sidebar to start.</p>
              <div class="flex-1"></div>
            </div>
          }
        </div>
      </main>
      }
    </div>
  `,
    styles: []
})
export class CourseFlowComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly courseService = inject(CourseService);

    readonly LESSON_COLORS = LESSON_COLORS;
    course: Course | null = null;
    loading = true;
    errorMessage: string | null = null;
    selectedLessonId: string | null = null;
    selectedQuizId: string | null = null;
    selectedLesson: CourseLesson | null = null;
    selectedQuizItem: CourseQuiz | null = null;

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            const courseId = params['courseId'];
            if (!courseId) {
                this.errorMessage = 'No course selected.';
                this.loading = false;
                return;
            }
            this.loadCourse(courseId);
        });
    }

    loadCourse(courseId: string): void {
        this.loading = true;
        this.errorMessage = null;
        this.course = null;
        this.selectedLessonId = null;
        this.selectedQuizId = null;
        this.selectedLesson = null;
        this.selectedQuizItem = null;
        this.courseService.getCourseById(courseId).subscribe({
            next: (c) => {
                this.course = c;
                if (!c.syllabus?.length && !c.quizzes?.length) {
                    this.errorMessage = 'This course has no content yet.';
                }
                this.loading = false;
            },
            error: () => {
                this.errorMessage = 'Could not load course.';
                this.loading = false;
            }
        });
    }

    selectLesson(lesson: CourseLesson): void {
        this.selectedLessonId = lesson.id;
        this.selectedQuizId = null;
        this.selectedLesson = lesson;
        this.selectedQuizItem = null;
    }

    selectQuiz(quiz: CourseQuiz): void {
        this.selectedQuizId = quiz.id;
        this.selectedLessonId = null;
        this.selectedLesson = null;
        this.selectedQuizItem = quiz;
    }
}
