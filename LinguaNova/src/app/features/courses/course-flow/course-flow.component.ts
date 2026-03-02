import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseLesson, CourseQuiz } from '../../../core/models/course.model';

const LESSON_COLORS = ['#2BBCB0', '#E67E22', '#2C3E50', '#E87B7B'] as const;

@Component({
    selector: 'app-course-flow',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="flex min-h-screen bg-gradient-to-br from-slate-50 via-[#F0F9F8] to-slate-50">
      @if (loading) {
        <div class="flex-1 flex flex-col items-center justify-center gap-4">
          <div class="w-12 h-12 border-2 border-[#2BBCB0]/30 border-t-[#2BBCB0] rounded-full animate-spin"></div>
          <p class="text-gray-500 text-sm font-medium">Loading course...</p>
        </div>
      } @else if (errorMessage) {
        <div class="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <p class="text-gray-700 text-center max-w-sm">{{ errorMessage }}</p>
          <a [routerLink]="['/courses/my-courses']" class="px-6 py-3 bg-[#2BBCB0] text-white rounded-xl font-semibold shadow-lg shadow-[#2BBCB0]/25 hover:shadow-[#2BBCB0]/40 hover:-translate-y-0.5 transition-all">Back to My Courses</a>
        </div>
      } @else if (course) {
      <!-- Sidebar -->
      <aside class="w-[240px] shrink-0 flex flex-col bg-white/80 backdrop-blur-sm border-r border-gray-200/80 shadow-sm ml-6 my-6 rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-gray-100">
          <a [routerLink]="['/courses/my-courses']" class="inline-flex items-center gap-2 text-gray-600 hover:text-[#2BBCB0] font-medium text-sm transition-colors" aria-label="Back">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
            Back
          </a>
        </div>
        <div class="flex-1 overflow-y-auto py-3 px-3">
          @for (section of course.syllabus; track section.id) {
            <div class="mb-4">
              <h2 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">{{ section.title || 'Module' }}</h2>
              <nav class="space-y-1">
                @for (lesson of section.lessons; track lesson.id; let i = $index) {
                  <button type="button" (click)="selectLesson(lesson)"
                    class="w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    [style.background]="selectedLessonId === lesson.id ? '#2BBCB0' : LESSON_COLORS[i % LESSON_COLORS.length]"
                    [class.ring-2]="selectedLessonId === lesson.id"
                    [class.ring-offset-2]="selectedLessonId === lesson.id"
                    [class.ring-[#2BBCB0]]="selectedLessonId === lesson.id"
                    [class.shadow-md]="selectedLessonId === lesson.id">
                    <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </span>
                    <span class="text-white text-xs font-semibold flex-1 min-w-0 truncate">{{ lesson.title }}</span>
                    <span class="text-white/80 text-[10px] font-medium shrink-0">{{ lesson.duration ?? '—' }}m</span>
                  </button>
                }
              </nav>
            </div>
          }
          @if (course.quizzes?.length) {
            <div class="mb-4 pt-2 border-t border-gray-100">
              <h2 class="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-3 mb-2">Practice Quiz</h2>
              <nav class="space-y-1">
                @for (quiz of course.quizzes; track quiz.id; let i = $index) {
                  <button type="button" (click)="selectQuiz(quiz)"
                    class="w-full text-left flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    [style.background]="selectedQuizId === quiz.id ? '#2BBCB0' : LESSON_COLORS[i % LESSON_COLORS.length]"
                    [class.ring-2]="selectedQuizId === quiz.id"
                    [class.ring-offset-2]="selectedQuizId === quiz.id"
                    [class.ring-[#2BBCB0]]="selectedQuizId === quiz.id"
                    [class.shadow-md]="selectedQuizId === quiz.id">
                    <span class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center shrink-0">
                      <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    </span>
                    <span class="text-white text-xs font-semibold flex-1 min-w-0 truncate">{{ quiz.title }}</span>
                    <span class="text-white/80 text-[10px] font-medium shrink-0">{{ quiz.questions?.length ?? 0 }} Q</span>
                  </button>
                }
              </nav>
            </div>
          }
        </div>
      </aside>

      <!-- Main -->
      <main class="flex-1 min-w-0 flex flex-col py-6 pr-8 overflow-auto">
        @if (selectedLesson) {
          <div class="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="h-1.5 flex-shrink-0 bg-gradient-to-r from-[#2BBCB0] to-[#2D9D94]"></div>
            <div class="flex-1 overflow-auto p-8">
              <h1 class="text-xl font-bold text-gray-900 mb-1">{{ selectedLesson.title }}</h1>
              <p class="text-sm text-gray-500 mb-6">
                {{ selectedLesson.type === 'video' ? 'Video lesson' : selectedLesson.type === 'reading' ? 'Reading' : 'Lesson' }}
                @if (selectedLesson.duration) { · {{ selectedLesson.duration }} min }
              </p>
                @if (getLessonMediaUrl(selectedLesson)) {
                <div class="rounded-xl border border-gray-200 bg-gray-900 overflow-hidden flex flex-col min-h-[480px]">
                  @if (isLessonPdf(selectedLesson)) {
                    <iframe [src]="getSanitizedLessonUrl(selectedLesson)" class="w-full flex-1 min-h-[500px]" title="{{ selectedLesson.title }}"></iframe>
                  } @else if (isLessonVideo(selectedLesson)) {
                    <video [src]="getSanitizedLessonUrl(selectedLesson)" controls class="w-full" controlsList="nodownload"></video>
                  } @else {
                    <iframe [src]="getSanitizedLessonUrl(selectedLesson)" class="w-full flex-1 min-h-[500px]" title="{{ selectedLesson.title }}"></iframe>
                  }
                </div>
                @if (selectedLesson.fileName) {
                  <p class="text-xs text-gray-500 mt-2">{{ selectedLesson.fileName }}</p>
                }
              } @else {
                <div class="rounded-xl bg-gray-50 border border-gray-100 p-6 text-gray-600 text-sm leading-relaxed">
                  <p class="mb-2">No file or video linked to this lesson yet.</p>
                  <p class="text-gray-500 text-xs">Add a PDF or video in <strong>Course Creation</strong>: open the lesson, click <strong>UPLOAD</strong>, choose a file, then save/publish the course. The file will appear here after that.</p>
                </div>
              }
            </div>
          </div>
        } @else if (selectedQuizItem) {
          @if (!quizStarted) {
            <!-- Quiz intro: fills main area, sidebar stays visible -->
            <div class="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="h-1.5 flex-shrink-0 bg-gradient-to-r from-[#2BBCB0] to-[#2D9D94]"></div>
              <div class="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div class="w-20 h-20 rounded-2xl bg-[#2BBCB0]/10 flex items-center justify-center mb-6">
                  <svg class="w-10 h-10 text-[#2BBCB0]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                </div>
                <h2 class="text-xl font-bold text-gray-900 mb-2">{{ selectedQuizItem.title }}</h2>
                <p class="text-gray-500 text-sm mb-6 max-w-sm">Answer all questions. You need {{ selectedQuizItem.passingScore ?? 70 }}% to pass.</p>
                <div class="flex flex-wrap justify-center gap-3 text-sm">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                    <svg class="w-4 h-4 text-[#2BBCB0]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    {{ selectedQuizItem.questions?.length ?? 0 }} questions
                  </span>
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2BBCB0]/10 text-[#2D9D94] font-medium">
                    {{ selectedQuizItem.passingScore ?? 70 }}% to pass
                  </span>
                </div>
                <button type="button" (click)="startQuiz()"
                  class="mt-10 px-10 py-4 bg-[#2BBCB0] text-white font-bold rounded-xl shadow-lg shadow-[#2BBCB0]/30 hover:shadow-[#2BBCB0]/50 hover:-translate-y-0.5 active:translate-y-0 transition-all text-base">
                  Start quiz
                </button>
              </div>
            </div>
          } @else {
          <div class="flex-1 flex flex-col min-w-0 min-h-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="h-1.5 flex-shrink-0 bg-gradient-to-r from-[#2BBCB0] to-[#2D9D94]"></div>
            <div class="flex-1 overflow-auto p-8">

                @if (quizSubmitted && quizScore !== null) {
                  <!-- Results -->
                  <div class="flex flex-col items-center text-center py-6">
                    <div class="w-28 h-28 rounded-full flex items-center justify-center mb-6 transition-all"
                      [class.bg-green-100]="quizPassed"
                      [class.bg-red-50]="!quizPassed">
                      <span class="text-4xl font-bold" [class.text-green-600]="quizPassed" [class.text-red-500]="!quizPassed">{{ quizScore }}%</span>
                    </div>
                    <h2 class="text-xl font-bold text-gray-900 mb-1" [class.text-green-700]="quizPassed" [class.text-red-700]="!quizPassed">
                      @if (quizPassed) { You passed! }
                      @else { Not quite }
                    </h2>
                    <p class="text-gray-500 text-sm mb-2">{{ quizCorrectCount }} of {{ selectedQuizItem.questions?.length ?? 0 }} correct</p>
                    <p class="text-gray-400 text-xs mb-8">Passing score: {{ selectedQuizItem.passingScore ?? 70 }}%</p>
                    <button type="button" (click)="retakeQuiz()"
                      class="px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-700 hover:border-[#2BBCB0] hover:text-[#2BBCB0] hover:bg-[#2BBCB0]/5 transition-colors">
                      Retake quiz
                    </button>
                  </div>
                } @else {
                  <!-- Questions -->
                  <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-gray-900">{{ selectedQuizItem.title }}</h2>
                    <span class="text-sm text-gray-500 font-medium">{{ selectedQuizItem.questions?.length ?? 0 }} questions</span>
                  </div>
                  <div class="space-y-8">
                    @for (q of selectedQuizItem.questions; track q.id; let i = $index) {
                      <div class="rounded-xl border-2 border-gray-100 bg-gray-50/50 p-5 transition-colors hover:border-gray-200">
                        <p class="font-semibold text-gray-900 mb-4 flex gap-2">
                          <span class="flex-shrink-0 w-7 h-7 rounded-lg bg-[#2BBCB0] text-white flex items-center justify-center text-sm font-bold">{{ i + 1 }}</span>
                          {{ q.text }}
                        </p>
                        <div class="grid gap-2">
                          @for (opt of q.options; track opt) {
                            <button type="button"
                              (click)="selectQuizOption(q.id, opt)"
                              class="flex items-center gap-3 text-left px-4 py-3.5 rounded-xl border-2 font-medium text-sm transition-all duration-200"
                              [class.border-[#2BBCB0]]="getSelectedOption(q.id) === opt"
                              [class.bg-[#2BBCB0]/10]="getSelectedOption(q.id) === opt"
                              [class.text-[#2D9D94]]="getSelectedOption(q.id) === opt"
                              [class.border-gray-200]="getSelectedOption(q.id) !== opt"
                              [class.bg-white]="getSelectedOption(q.id) !== opt"
                              [class.text-gray-700]="getSelectedOption(q.id) !== opt"
                              [class.hover:border-[#2BBCB0]/50]="getSelectedOption(q.id) !== opt"
                              [class.hover:bg-[#2BBCB0]/5]="getSelectedOption(q.id) !== opt">
                              <span class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                                [class.border-[#2BBCB0]]="getSelectedOption(q.id) === opt"
                                [class.bg-[#2BBCB0]]="getSelectedOption(q.id) === opt"
                                [class.border-gray-300]="getSelectedOption(q.id) !== opt">
                                @if (getSelectedOption(q.id) === opt) {
                                  <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                }
                              </span>
                              {{ opt }}
                            </button>
                          }
                        </div>
                      </div>
                    }
                  </div>
                  <div class="mt-10 pt-6 border-t border-gray-100 flex justify-end">
                    <button type="button" (click)="submitQuiz()"
                      class="px-8 py-3.5 bg-[#2BBCB0] text-white font-bold rounded-xl shadow-lg shadow-[#2BBCB0]/25 hover:shadow-[#2BBCB0]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                      Submit quiz
                    </button>
                  </div>
                }
              </div>
          </div>
          }
        } @else {
          <!-- Empty state -->
          <div class="max-w-3xl flex flex-col items-center justify-center min-h-[420px] text-center">
            <div class="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h2 class="text-xl font-bold text-gray-900 mb-2">Course content</h2>
            <p class="text-gray-500 text-sm max-w-md mb-2">{{ course.description }}</p>
            <p class="text-gray-400 text-sm">Choose a lesson or quiz from the sidebar to start.</p>
          </div>
        }
      </main>
      }
    </div>
  `,
    styles: []
})
export class CourseFlowComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly courseService = inject(CourseService);
    private readonly sanitizer = inject(DomSanitizer);

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
        const progress = this.currentLessonProgress;
        if (this.course?.id && progress >= 0) {
            this.courseService.updateProgressPercent(this.course.id, progress).subscribe({ error: () => {} });
        }
    }

    /** All lessons in order (across all sections) for progress calculation. */
    get allLessons(): CourseLesson[] {
        if (!this.course?.syllabus) return [];
        return this.course.syllabus.flatMap(s => s.lessons ?? []);
    }

    get totalLessonsCount(): number {
        return this.allLessons.length || 0;
    }

    /** 1-based index of the currently selected lesson (1 = first lesson). */
    get currentLessonIndex(): number {
        if (!this.selectedLessonId || this.totalLessonsCount === 0) return 0;
        const idx = this.allLessons.findIndex(l => l.id === this.selectedLessonId);
        return idx < 0 ? 0 : idx + 1;
    }

    /** Progress percentage: 100% when viewing last lesson (or only lesson), 10% when viewing first of 10, etc. */
    get currentLessonProgress(): number {
        const total = this.totalLessonsCount;
        if (total === 0) return 0;
        const current = this.currentLessonIndex;
        return Math.round((current / total) * 100);
    }

    /** Raw URL for lesson file or video (absolute). */
    getLessonMediaUrl(lesson: CourseLesson): string | null {
        const raw = lesson?.fileUrl ?? (lesson as any)?.file_url ?? lesson?.videoUrl ?? null;
        if (!raw || typeof raw !== 'string') return null;
        const s = raw.trim();
        if (!s) return null;
        if (s.startsWith('http://') || s.startsWith('https://')) return s;
        const base = typeof window !== 'undefined' ? window.location.origin : '';
        const path = s.startsWith('/') ? s : `/${s}`;
        return base + path;
    }

    isLessonPdf(lesson: CourseLesson): boolean {
        const url = (lesson?.fileUrl ?? (lesson as any)?.file_url ?? lesson?.videoUrl ?? '').toString();
        const type = (lesson?.type ?? '').toString().toLowerCase();
        return type === 'reading' || type === 'pdf' || url.toLowerCase().endsWith('.pdf');
    }

    isLessonVideo(lesson: CourseLesson): boolean {
        const url = (lesson?.fileUrl ?? (lesson as any)?.file_url ?? lesson?.videoUrl ?? '').toString();
        const type = (lesson?.type ?? '').toString().toLowerCase();
        const videoExt = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url);
        return type === 'video' || videoExt;
    }

    getSanitizedLessonUrl(lesson: CourseLesson): SafeResourceUrl {
        const url = this.getLessonMediaUrl(lesson);
        return url ? this.sanitizer.bypassSecurityTrustResourceUrl(url) : this.sanitizer.bypassSecurityTrustResourceUrl('about:blank');
    }

    selectQuiz(quiz: CourseQuiz): void {
        this.selectedQuizId = quiz.id;
        this.selectedLessonId = null;
        this.selectedLesson = null;
        this.selectedQuizItem = quiz;
        this.quizStarted = false;
        this.quizAnswers = {};
        this.quizSubmitted = false;
        this.quizScore = null;
        this.quizCorrectCount = 0;
    }

    quizStarted = false;
    quizAnswers: Record<string, string> = {};
    quizSubmitted = false;
    quizScore: number | null = null;
    quizCorrectCount = 0;

    get quizPassed(): boolean {
        if (this.selectedQuizItem == null || this.quizScore == null) return false;
        const passing = this.selectedQuizItem.passingScore ?? 70;
        return this.quizScore >= passing;
    }

    startQuiz(): void {
        this.quizStarted = true;
        this.quizAnswers = {};
        this.quizSubmitted = false;
        this.quizScore = null;
        this.quizCorrectCount = 0;
    }

    getSelectedOption(questionId: string): string | null {
        return this.quizAnswers[questionId] ?? null;
    }

    selectQuizOption(questionId: string, option: string): void {
        this.quizAnswers = { ...this.quizAnswers, [questionId]: option };
    }

    submitQuiz(): void {
        if (!this.selectedQuizItem?.questions?.length) return;
        let correct = 0;
        for (const q of this.selectedQuizItem.questions) {
            const selected = this.quizAnswers[q.id];
            if (selected != null && q.correctAnswer != null && selected === q.correctAnswer) {
                correct++;
            }
        }
        this.quizCorrectCount = correct;
        const total = this.selectedQuizItem.questions.length;
        this.quizScore = total > 0 ? Math.round((correct / total) * 100) : 0;
        this.quizSubmitted = true;
    }

    retakeQuiz(): void {
        this.quizStarted = false;
        this.quizAnswers = {};
        this.quizSubmitted = false;
        this.quizScore = null;
        this.quizCorrectCount = 0;
    }
}
