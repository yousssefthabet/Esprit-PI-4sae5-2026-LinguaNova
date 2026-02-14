import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CourseCategory, CourseLevel } from '../../../core/models/course.model';
import { QuizEditorComponent } from './quiz-editor/quiz-editor.component';
import { Quiz } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-course-creation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    QuizEditorComponent
  ],
  template: `
    <div class="bg-[#F8FAFC] min-h-screen pb-20 font-sans">
      
      <!-- Premium Header -->
      <header class="bg-white border-b border-gray-100 pt-16 pb-12 overflow-hidden relative">
        <!-- Ambient elements -->
        <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-50/30 to-transparent pointer-events-none"></div>
        <div class="container mx-auto px-4 max-w-[1000px] relative z-10">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                 <button routerLink="/dashboard/instructor" class="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D9488] transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                 </button>
                 <span class="text-gray-300">/</span>
                 <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Course Architect</span>
              </div>
              <h1 class="text-4xl font-black text-gray-900 tracking-tight">Create New Course</h1>
            </div>
            <div class="flex items-center gap-3">
               <button (click)="saveDraft()" class="px-6 py-2.5 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all">Save Draft</button>
               <button (click)="submitCourse()" [disabled]="courseForm.invalid" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all disabled:opacity-50">Publish Course</button>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-4 max-w-[1000px] py-12">
        
        <!-- Modern Step Indicator -->
        <div class="mb-12 flex items-center justify-between px-4 overflow-x-auto pb-4">
          @for (step of steps; track step.id) {
            <div class="flex items-center shrink-0">
               <div class="flex flex-col items-center gap-2 group cursor-pointer" (click)="goToStep(step.id)">
                  <div [class]="'w-10 h-10 rounded-[14px] flex items-center justify-center font-black transition-all duration-300 ' + 
                    (currentStep === step.id ? 'bg-[#0D9488] text-white shadow-xl shadow-teal-100' : 
                     currentStep > step.id ? 'bg-teal-100 text-[#0D9488]' : 'bg-white border border-gray-100 text-gray-300')">
                    @if (currentStep > step.id) {
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    } @else {
                      {{ step.id }}
                    }
                  </div>
                  <span [class]="'text-[10px] font-black uppercase tracking-widest transition-colors ' + (currentStep === step.id ? 'text-[#0D9488]' : 'text-gray-300')">{{ step.label }}</span>
               </div>
               @if (step.id < steps.length) {
                 <div class="w-16 h-0.5 bg-gray-100 mx-6 rounded-full">
                    <div class="h-full bg-[#0D9488] transition-all duration-500" [style.width]="currentStep > step.id ? '100%' : '0%'"></div>
                 </div>
               }
            </div>
          }
        </div>

        <!-- Form Content Container -->
        <app-card class="p-0 rounded-[32px] border-none shadow-xl shadow-gray-200/40 overflow-hidden bg-white">
          <form [formGroup]="courseForm">
            
            <!-- Step 1: Basic Information -->
            @if (currentStep === 1) {
              <div class="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center gap-4 mb-10">
                   <div class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488]">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h2 class="text-2xl font-black text-gray-900 tracking-tight">Essential Details</h2>
                </div>

                <div class="space-y-8">
                  <div class="flex flex-col gap-2">
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Title</label>
                    <input type="text" formControlName="title" placeholder="e.g. Master Clinical English & Terminology" 
                           class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm" />
                  </div>
                  
                  <div class="flex flex-col gap-2">
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Short Hook</label>
                    <input type="text" formControlName="shortDescription" placeholder="A one-sentence summary to grab attention" 
                           class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 placeholder:text-gray-300 shadow-sm" />
                  </div>

                  <div class="flex flex-col gap-2">
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Prospectus</label>
                    <textarea formControlName="description" rows="5" placeholder="Deep dive into the course value and structure..." 
                               class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 placeholder:text-gray-300 shadow-sm resize-none"></textarea>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="flex flex-col gap-2">
                      <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Academic Category</label>
                      <select formControlName="category" class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 font-bold appearance-none shadow-sm">
                        @for (cat of categories; track cat) {
                          <option [value]="cat">{{ cat.replace('_', ' ') }}</option>
                        }
                      </select>
                    </div>
                    <div class="flex flex-col gap-2">
                      <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Skill Elevation</label>
                      <select formControlName="level" class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 font-bold appearance-none shadow-sm">
                        @for (lvl of levels; track lvl) {
                          <option [value]="lvl">{{ lvl }}</option>
                        }
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- Step 2: Curriculum -->
            @if (currentStep === 2) {
              <div class="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center justify-between mb-10">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                     </div>
                     <h2 class="text-2xl font-black text-gray-900 tracking-tight">Curriculum Design</h2>
                  </div>
                  <button (click)="addSection()" class="text-[#0D9488] font-black text-xs uppercase tracking-widest hover:underline">+ New Section</button>
                </div>

                <div class="space-y-6">
                  <div formArrayName="syllabus">
                    @for (section of syllabusFormArray.controls; track $index; let sIdx = $index) {
                      <div [formGroupName]="sIdx" class="bg-gray-50/50 p-8 rounded-[28px] border border-gray-100 mb-8 relative group hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
                        <button (click)="removeSection(sIdx)" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        
                        <div class="flex flex-col gap-6">
                          <input type="text" formControlName="title" placeholder="Module Title (e.g. Introduction to Grammar)" 
                                 class="bg-transparent border-b-2 border-gray-100 py-3 focus:outline-none focus:border-[#0D9488] font-black text-xl text-gray-900 transition-colors" />
                          
                          <div formArrayName="lessons" class="space-y-3 pl-0">
                            @for (lesson of getLessonsFormArray(sIdx).controls; track $index) {
                              <div [formGroupName]="$index" class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm relative group/lesson">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">{{ $index + 1 }}</div>
                                <input type="text" formControlName="title" placeholder="Lesson Subject" class="flex-1 text-sm font-bold text-gray-700 focus:outline-none" />
                                <div class="flex items-center gap-2">
                                  <select formControlName="type" class="text-[10px] font-black text-[#0D9488] uppercase bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100 appearance-none">
                                    <option value="video">🎥 Video</option>
                                    <option value="reading">📄 PDF</option>
                                    <option value="quiz">📝 Quiz</option>
                                  </select>
                                  <button (click)="removeLesson(sIdx, $index)" class="opacity-0 group-hover/lesson:opacity-100 text-gray-300 hover:text-red-500 transition-all ml-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              </div>
                            }
                            <button (click)="addLesson(sIdx)" class="w-full py-4 mt-2 border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 font-black text-xs uppercase tracking-widest hover:border-[#0D9488] hover:text-[#0D9488] transition-all">
                               + Add Lesson Point
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            }

            <!-- Step 3: Assessment -->
            @if (currentStep === 3) {
              <div class="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center justify-between mb-10">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                     </div>
                     <h2 class="text-2xl font-black text-gray-900 tracking-tight">Assessments & Quizzes</h2>
                  </div>
                  <button (click)="addNewQuiz()" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">+ Add New Quiz</button>
                </div>
                
                <div class="space-y-8">
                  @for (quiz of quizzes; track $index) {
                    <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 relative group overflow-hidden">
                       <div class="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[100%] pointer-events-none"></div>
                       <button (click)="removeQuiz($index)" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors z-10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <app-quiz-editor [quiz]="quiz" (quizChange)="updateQuiz($index, $event)"></app-quiz-editor>
                    </div>
                  }

                  @if (quizzes.length === 0) {
                    <div class="text-center py-24 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
                      <div class="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-gray-200 mx-auto mb-6 shadow-sm">
                         <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </div>
                      <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">No evaluative content added</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Step 4: Monetization -->
            @if (currentStep === 4) {
              <div class="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center gap-4 mb-10">
                   <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h2 class="text-2xl font-black text-gray-900 tracking-tight">Monetization & Privacy</h2>
                </div>

                <div class="grid lg:grid-cols-2 gap-10">
                  <div class="space-y-8">
                    <div class="bg-gray-50/50 p-8 rounded-[28px] border border-gray-100">
                       <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Listing Price</label>
                       <div class="relative">
                          <span class="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-gray-300">TND</span>
                          <input type="number" formControlName="price" class="w-full pl-24 pr-6 py-5 rounded-2xl border border-gray-100 bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-3xl font-black text-gray-900 shadow-inner" />
                       </div>
                       <p class="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">Net earnings will be calculated after 15% platform fee.</p>
                    </div>
                  </div>

                  <div class="flex flex-col justify-center gap-6">
                    <div class="bg-teal-50/50 p-8 rounded-[28px] border border-teal-100 flex items-start gap-5">
                       <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#0D9488] shadow-sm shrink-0">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <div>
                          <h4 class="font-black text-gray-900 tracking-tight text-lg mb-1">Architect's Ready</h4>
                          <p class="text-sm text-gray-500 font-medium">Your curriculum is structured and ready for the global student network.</p>
                       </div>
                    </div>
                    
                    <label class="flex items-center gap-4 p-6 hover:bg-white transition-all cursor-pointer group">
                       <div class="relative w-6 h-6 shrink-0">
                          <input type="checkbox" formControlName="isPublished" class="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                          <div class="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:bg-[#0D9488] peer-checked:border-[#0D9488] transition-all"></div>
                          <svg class="absolute top-1 left-1 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                       </div>
                       <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Apply immediate launch sequence after validation</span>
                    </label>
                  </div>
                </div>
              </div>
            }
          </form>

          <!-- Action Footer -->
          <div class="bg-gray-50/50 p-8 md:px-12 py-10 border-t border-gray-100 flex items-center justify-between">
            <button (click)="prevStep()" [disabled]="currentStep === 1" class="px-8 py-3 bg-white border border-gray-200 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30">Previous Phase</button>
            <div class="flex gap-4">
              @if (currentStep < steps.length) {
                <button (click)="nextStep()" class="px-10 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-95">Next Segment</button>
              } @else {
                <button (click)="submitCourse()" [disabled]="courseForm.invalid" class="px-10 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-xl shadow-teal-200 hover:bg-[#0D5E5B] transition-all active:scale-95">Finalize & Deploy</button>
              }
            </div>
          </div>
        </app-card>
      </div>
    </div>
    `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    :host { display: block; }
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  `]
})
export class CourseCreationComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  currentStep = 1;
  steps = [
    { id: 1, label: 'Blueprint' },
    { id: 2, label: 'Structure' },
    { id: 3, label: 'Qualifiers' },
    { id: 4, label: 'Deploy' }
  ];

  categories = Object.values(CourseCategory);
  levels = Object.values(CourseLevel);
  quizzes: Quiz[] = [];

  courseForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    category: [CourseCategory.WEB_DEVELOPMENT, Validators.required],
    level: [CourseLevel.BEGINNER, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    isPublished: [false],
    syllabus: this.fb.array([])
  });

  get syllabusFormArray() {
    return this.courseForm.get('syllabus') as FormArray;
  }

  getLessonsFormArray(sectionIndex: number) {
    return this.syllabusFormArray.at(sectionIndex).get('lessons') as FormArray;
  }

  addSection() {
    const section = this.fb.group({
      title: ['', Validators.required],
      lessons: this.fb.array([])
    });
    this.syllabusFormArray.push(section);
    this.addLesson(this.syllabusFormArray.length - 1);
  }

  removeSection(index: number) {
    this.syllabusFormArray.removeAt(index);
  }

  addLesson(sectionIndex: number) {
    const lesson = this.fb.group({
      title: ['', Validators.required],
      type: ['video', Validators.required]
    });
    this.getLessonsFormArray(sectionIndex).push(lesson);
  }

  removeLesson(sectionIndex: number, lessonIndex: number) {
    this.getLessonsFormArray(sectionIndex).removeAt(lessonIndex);
  }

  addNewQuiz() {
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Quiz',
      questions: [],
      passingScore: 70,
      isFinalExam: false
    };
    this.quizzes.push(newQuiz);
  }

  updateQuiz(index: number, updatedQuiz: Quiz) {
    this.quizzes[index] = updatedQuiz;
  }

  removeQuiz(index: number) {
    this.quizzes.splice(index, 1);
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goToStep(stepId: number) {
    if (stepId < this.currentStep || this.currentStep === this.steps.length) {
      this.currentStep = stepId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  saveDraft() {
    console.log('Saving draft...', this.courseForm.value, this.quizzes);
    this.router.navigate(['/dashboard/instructor']);
  }

  submitCourse() {
    if (this.courseForm.valid) {
      console.log('Submitting Course...', {
        ...this.courseForm.value,
        quizzes: this.quizzes
      });
      this.router.navigate(['/dashboard/instructor']);
    }
  }
}
