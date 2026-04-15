import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CourseCategory, CourseLevel, CreateCoursePayload } from '../../../core/models/course.model';
import { QuizEditorComponent } from './quiz-editor/quiz-editor.component';
import { Quiz, Question } from '../../../core/models/quiz.model';
import { CourseService } from '../../../core/services/course.service';

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
      <!-- Backend connectivity warning -->
      @if (backendReachable === false) {
        <div class="bg-amber-600 text-white px-4 py-3 flex flex-wrap items-center justify-center gap-3 text-sm font-medium" role="alert">
          <span>Course backend not reachable. Start MySQL (3306) and run Spring Boot in <code class="bg-black/20 px-1 rounded">.angular/microservices/courss-service</code> (port 8081).</span>
          <button type="button" (click)="checkBackend()" class="bg-white text-amber-800 px-3 py-1 rounded font-bold hover:bg-amber-100">Retry connection</button>
        </div>
      }

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
               <button type="button" (click)="saveDraft()" class="px-6 py-2.5 bg-gray-50 text-gray-500 font-bold rounded-xl hover:bg-gray-100 transition-all">Save Draft</button>
               <button type="button" (click)="submitCourse()" [disabled]="isSubmitting" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all disabled:opacity-50">Publish Course</button>
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
          <form [formGroup]="courseForm" (ngSubmit)="submitCourse()">
            <!-- Global message: visible at top so user always sees it -->
            @if (submitError) {
              <div class="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3" role="alert">
                <span>{{ submitError }}</span>
              </div>
            }
            @if (submitSuccess) {
              <div class="mx-8 mt-6 p-5 bg-green-50 border border-green-200 rounded-xl text-green-800 flex items-center gap-3 animate-in fade-in duration-300" role="status">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-200 text-green-700">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                </span>
                <div class="flex-1">
                  <p class="font-bold">{{ editMode ? 'Course updated successfully!' : 'Course created successfully!' }}</p>
                  <p class="text-sm text-green-600 mt-0.5">All data saved to database PI.</p>
                  @if (showRedirectMessage) {
                    <p class="text-sm text-green-600 mt-2 flex items-center gap-2">
                      <span class="inline-block w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></span>
                      Redirecting you to teacher space...
                    </p>
                  }
                </div>
              </div>
            }

            <!-- Step 1: Basic Information -->
            @if (currentStep === 1) {
              <div class="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="flex items-center gap-4 mb-10">
                   <div class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488]">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                   </div>
                   <h2 class="text-2xl font-black text-gray-900 tracking-tight">Essential Details</h2>
                </div>
                <div class="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3" role="status">
                  <span class="shrink-0 mt-0.5 text-amber-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <span>{{ getStepRequirementsMessage(1) }}</span>
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

                  <div class="flex flex-col gap-4">
                    <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Course Thumbnail</label>
                    <div class="flex items-center gap-6">
                      <div class="w-full max-w-xs aspect-video rounded-2xl bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden shadow-inner">
                        @if (courseForm.get('image')?.value) {
                          <img [src]="courseForm.get('image')?.value" class="w-full h-full object-cover" alt="Course Thumbnail" />
                        } @else {
                          <svg class="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        }
                      </div>
                      <div class="flex flex-col gap-2">
                        <button type="button" (click)="imageInput.click()" 
                          class="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:border-[#0D9488] hover:text-[#0D9488] transition-all flex items-center gap-2">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                          Select Course Thumbnail
                        </button>
                        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended: 16:9 Aspect Ratio</p>
                        <input #imageInput type="file" class="hidden" accept="image/*" (change)="onImageSelected($event)" />
                      </div>
                    </div>
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
                  <button type="button" (click)="addSection()" class="text-[#0D9488] font-black text-xs uppercase tracking-widest hover:underline">+ New Section</button>
                </div>
                <div class="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3" role="status">
                  <span class="shrink-0 mt-0.5 text-amber-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <span>{{ getStepRequirementsMessage(2) }}</span>
                </div>
                <div class="space-y-6">
                  <div formArrayName="syllabus">
                    @for (section of syllabusFormArray.controls; track $index; let sIdx = $index) {
                      <div [formGroupName]="sIdx" class="bg-gray-50/50 p-8 rounded-[28px] border border-gray-100 mb-8 relative group hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 transition-all duration-300">
                        <button type="button" (click)="removeSection(sIdx)" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                        
                        <div class="flex flex-col gap-6">
                          <input type="text" formControlName="title" placeholder="Module Title (e.g. Introduction to Grammar)" 
                                 class="bg-transparent border-b-2 border-gray-100 py-3 focus:outline-none focus:border-[#0D9488] font-black text-xl text-gray-900 transition-colors" />
                          
                          <div formArrayName="lessons" class="space-y-3 pl-0">
                            @for (lesson of getLessonsFormArray(sIdx).controls; track $index; let lIdx = $index) {
                              <div class="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-50 shadow-sm relative group/lesson">
                                <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400">{{ lIdx + 1 }}</div>
                                <input type="text" [formControl]="$any(lesson).get('title')" placeholder="Lesson Subject" class="flex-1 text-sm font-bold text-gray-700 focus:outline-none" />
                                
                                <div class="flex items-center gap-2">
                                  <div class="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                                    <button 
                                      type="button"
                                      (click)="setLessonType(sIdx, lIdx, 'video')"
                                      [class]="'px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ' + 
                                        (lesson.get('type')?.value === 'video' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600')">
                                      VIDEO
                                    </button>
                                    <button 
                                      type="button"
                                      (click)="setLessonType(sIdx, lIdx, 'reading')"
                                      [class]="'px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ' + 
                                        (lesson.get('type')?.value === 'reading' ? 'bg-[#0D9488] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600')">
                                      PDF
                                    </button>
                                  </div>
                                  
                                  <button 
                                    type="button"
                                    (click)="fileInput.click()" 
                                    class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-[10px] font-black text-gray-500 hover:border-[#0D9488] hover:text-[#0D9488] transition-all max-w-[150px]">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <span class="truncate">{{ lesson.get('fileName')?.value || 'UPLOAD' }}</span>
                                  </button>
                                  
                                  <input 
                                    #fileInput 
                                    type="file" 
                                    class="hidden" 
                                    [accept]="lesson.get('type')?.value === 'video' ? 'video/*' : lesson.get('type')?.value === 'reading' ? '.pdf' : '*'"
                                    (change)="handleFileSelect($event, sIdx, lIdx)" />

                                  <button type="button" (click)="removeLesson(sIdx, lIdx)" class="opacity-0 group-hover/lesson:opacity-100 text-gray-300 hover:text-red-500 transition-all ml-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                  </button>
                                </div>
                              </div>
                            }
                            <button type="button" (click)="addLesson(sIdx)" class="w-full py-4 mt-2 border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 font-black text-xs uppercase tracking-widest hover:border-[#0D9488] hover:text-[#0D9488] transition-all">
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
                  <div class="flex items-center gap-3">
                    <button type="button" (click)="generateQuiz()" class="px-6 py-2.5 bg-white border border-[#0D9488] text-[#0D9488] font-bold rounded-xl hover:bg-teal-50 transition-all">Generate Quiz</button>
                    <button type="button" (click)="addNewQuiz()" class="px-6 py-2.5 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all">+ Add New Quiz</button>
                  </div>
                </div>
                <div class="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3" role="status">
                  <span class="shrink-0 mt-0.5 text-amber-500">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </span>
                  <span>{{ getStepRequirementsMessage(3) }}</span>
                </div>
                <div class="space-y-8">
                  @for (quiz of quizzes; track $index) {
                    <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/20 relative group overflow-hidden">
                       <div class="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-bl-[100%] pointer-events-none"></div>
                       <button type="button" (click)="removeQuiz($index)" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors z-10">
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

                <div class="mt-12 pt-10 border-t border-gray-100 grid lg:grid-cols-2 gap-10">
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
                  </div>
                </div>
              </div>
            }
          </form>

          <!-- Action Footer -->
          <div class="bg-gray-50/50 p-8 md:px-12 py-10 border-t border-gray-100">
            @if (currentStep === steps.length && (submitError || submitSuccess)) {
              <div class="mb-4 p-4 rounded-xl text-sm font-medium" [class]="submitSuccess ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'">
                @if (submitSuccess) {
                  <span>All course data saved to database PI. {{ editMode ? 'Course updated' : 'Course created' }} successfully. Taking you back to your teacher space...</span>
                } @else {
                  <span>{{ submitError }}</span>
                }
              </div>
            }
            <div class="flex items-center justify-between">
              <button type="button" (click)="prevStep()" [disabled]="currentStep === 1" class="px-8 py-3 bg-white border border-gray-200 text-gray-400 font-bold rounded-xl hover:bg-gray-100 transition-all disabled:opacity-30">Previous Phase</button>
              <div class="flex gap-4">
                @if (currentStep < steps.length) {
                  <button type="button" (click)="nextStep()" class="px-10 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-95">Next Segment</button>
                } @else {
                  <button type="button" (click)="submitCourse()" [disabled]="isSubmitting" class="px-10 py-3 bg-[#0D9488] text-white font-bold rounded-xl shadow-xl shadow-teal-200 hover:bg-[#0D5E5B] transition-all active:scale-95 disabled:opacity-60">
                    {{ isSubmitting ? 'Submitting to database...' : 'Publish Course' }}
                  </button>
                }
              </div>
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
export class CourseCreationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  isSubmitting = false;
  submitError = '';
  submitSuccess = false;
  showRedirectMessage = false;
  editMode = false;
  editCourseId: string | null = null;
  /** null = not checked yet, true = reachable, false = not reachable */
  backendReachable: boolean | null = null;

  /** Route path segments that are not course IDs - avoid calling getCourseById with these. */
  private static readonly RESERVED_PATH_SEGMENTS = new Set([
    'course-creation', 'edit', 'my-courses', 'instructor-courses', 'search', ''
  ]);

  ngOnInit() {
    this.checkBackend();
    const rawId = this.route.snapshot.paramMap.get('id');
    const id = rawId?.trim();
    if (id && !CourseCreationComponent.RESERVED_PATH_SEGMENTS.has(id)) {
      this.editCourseId = id;
      this.editMode = true;
      this.courseService.getCourseById(this.editCourseId).subscribe({
        next: (course) => {
          this.courseForm.patchValue({
            title: course.title,
            shortDescription: course.shortDescription,
            description: course.description,
            category: course.category,
            level: course.level,
            price: course.price,
            image: course.image
          });
        },
        error: (err) => {
          console.error('Failed to load course for editing', err);
          if (err?.status === 404) {
            this.editMode = false;
            this.editCourseId = null;
          }
        }
      });
    }
  }

  /** Check if course backend (port 8081) is reachable via proxy. Call from template (Retry). */
  checkBackend(): void {
    this.backendReachable = null;
    this.courseService.getCourses({ page: 1, limit: 1 }).subscribe({
      next: () => { this.backendReachable = true; },
      error: () => { this.backendReachable = false; }
    });
  }

  currentStep = 1;
  steps = [
    { id: 1, label: 'Blueprint' },
    { id: 2, label: 'Structure' },
    { id: 3, label: 'Qualifiers' }
  ];

  categories = Object.values(CourseCategory);
  levels = Object.values(CourseLevel);
  quizzes: Quiz[] = [];

  courseForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(10)]],
    shortDescription: ['', [Validators.required, Validators.maxLength(150)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    category: [CourseCategory.ENGLISH_LANGUAGE, Validators.required],
    level: [CourseLevel.BEGINNER, Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    image: [''],
    isPublished: [false],
    syllabus: this.fb.array([])
  });

  get syllabusFormArray() {
    return this.courseForm.get('syllabus') as FormArray;
  }

  /** Resize/compress image so payload stays under MySQL max_allowed_packet (~1MB). Target ~700KB base64. */
  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      this.compressImageForPayload(dataUrl).then((compressed) => {
        this.courseForm.patchValue({ image: compressed });
      }).catch(() => {
        this.courseForm.patchValue({ image: dataUrl });
      });
    };
    reader.readAsDataURL(file);
  }

  /** Resize to max 800px and compress as JPEG to stay under ~700KB base64 (avoids MySQL packet size limit). */
  private compressImageForPayload(dataUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const maxW = 800;
        const maxH = 450;
        let w = img.width;
        let h = img.height;
        if (w > maxW || h > maxH) {
          const r = Math.min(maxW / w, maxH / h);
          w = Math.round(w * r);
          h = Math.round(h * r);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const targetSizeBytes = 700 * 1024;
        let quality = 0.82;
        const tryEncode = () => {
          const jpeg = canvas.toDataURL('image/jpeg', quality);
          if (jpeg.length <= targetSizeBytes || quality <= 0.5) {
            resolve(jpeg);
            return;
          }
          quality -= 0.12;
          if (quality >= 0.5) tryEncode();
          else resolve(canvas.toDataURL('image/jpeg', 0.5));
        };
        tryEncode();
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = dataUrl;
    });
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
      type: ['video', Validators.required],
      fileName: [''],
      fileUrl: ['']
    });
    this.getLessonsFormArray(sectionIndex).push(lesson);
  }

  handleFileSelect(event: any, sIdx: number, lIdx: number) {
    const file = event.target.files[0];
    if (!file) return;
    const lessonGroup = this.getLessonsFormArray(sIdx).at(lIdx);
    lessonGroup.patchValue({ fileName: file.name });
    this.courseService.uploadLessonFile(file).subscribe({
      next: (res) => {
        lessonGroup.patchValue({ fileUrl: res.fileUrl, fileName: res.fileName });
      },
      error: (err) => {
        console.error('Upload failed', err);
        lessonGroup.patchValue({ fileUrl: '', fileName: '' });
      }
    });
    (event.target as HTMLInputElement).value = '';
  }

  setLessonType(sIdx: number, lIdx: number, type: string) {
    this.getLessonsFormArray(sIdx).at(lIdx).patchValue({
      type: type,
      fileName: '',
      fileUrl: ''
    });
  }

  removeLesson(sectionIndex: number, lessonIndex: number) {
    this.getLessonsFormArray(sectionIndex).removeAt(lessonIndex);
  }

  addNewQuiz() {
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Quiz',
      questions: [],
      passingScore: 70
    };
    this.quizzes.push(newQuiz);
  }

  /** Generate quizzes from curriculum: one quiz per module (section), with questions based on lesson titles. */
  generateQuiz() {
    const syllabus = this.syllabusFormArray;
    if (!syllabus?.length) {
      return;
    }
    const sections = syllabus.controls as Array<{ get: (name: string) => any }>;
    for (const sectionCtrl of sections) {
      const titleCtrl = sectionCtrl.get('title');
      const lessonsCtrl = sectionCtrl.get('lessons');
      const moduleTitle = (titleCtrl?.value ?? '').trim() || 'Module';
      const lessons = lessonsCtrl?.value ?? [];
      const lessonTitles = (lessons as Array<{ title?: string }>)
        .map(l => (l?.title ?? '').trim())
        .filter(Boolean);
      const questions: Question[] = [];
      for (const lessonTitle of lessonTitles) {
        const correct = `Key concept from: ${lessonTitle}`;
        questions.push({
          id: Math.random().toString(36).substr(2, 9),
          text: `What did you learn in "${lessonTitle}"?`,
          type: 'multiple_choice',
          options: [
            correct,
            'General overview',
            'Additional details',
            'Summary points'
          ],
          correctAnswer: correct,
          explanation: 'Review the lesson to consolidate your understanding.',
          points: 10
        });
      }
      if (questions.length === 0) {
        questions.push({
          id: Math.random().toString(36).substr(2, 9),
          text: `What are the main takeaways from "${moduleTitle}"?`,
          type: 'multiple_choice',
          options: ['Key concepts', 'Examples', 'Practice', 'Summary'],
          correctAnswer: 'Key concepts',
          explanation: 'Edit this question to match your module content.',
          points: 10
        });
      }
      const quiz: Quiz = {
        id: Math.random().toString(36).substr(2, 9),
        title: `Quiz: ${moduleTitle}`,
        questions,
        passingScore: 70
      };
      this.quizzes.push(quiz);
    }
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

  /** Step-specific requirement message shown as a warning in each step. */
  getStepRequirementsMessage(stepId: number): string {
    switch (stepId) {
      case 1:
        return 'Please complete all required fields: Title (min 10 chars), Short hook (required, max 150 chars), and Description (min 50 chars).';
      case 2:
        return 'Please add at least one section with a title, and at least one lesson with a title in each section.';
      case 3:
        return 'Quizzes are optional. Set price (≥ 0) and use "Publish Course" below when ready.';
      default:
        return '';
    }
  }

  saveDraft() {
    const payload = this.buildPayload(false);
    this.isSubmitting = true;
    const request$ = this.editMode && this.editCourseId
      ? this.courseService.updateCourse(this.editCourseId, payload)
      : this.courseService.createCourse(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/courses/instructor-courses']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Failed to save draft. Please try again.';
        console.error(err);
      }
    });
  }

  submitCourse() {
    this.submitError = '';
    this.submitSuccess = false;
    this.showRedirectMessage = false;

    const structureErrors = this.getStructureErrors();
    if (structureErrors.length > 0) {
      this.currentStep = 2;
      this.courseForm.markAllAsTouched();
      this.submitError = `Structure: ${structureErrors.join(' ')}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.logInvalidState();
      return;
    }

    if (!this.courseForm.valid) {
      this.courseForm.markAllAsTouched();
      this.currentStep = this.getFirstInvalidStep();
      this.submitError = this.getHumanValidationMessage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      this.logInvalidState();
      return;
    }

    const payload = this.buildPayload(true);
    this.isSubmitting = true;
    const request$ = this.editMode && this.editCourseId
      ? this.courseService.updateCourse(this.editCourseId, payload)
      : this.courseService.createCourse(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          this.showRedirectMessage = true;
        }, 400);
        setTimeout(() => this.router.navigate(['/dashboard/instructor']), 2200);
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg = this.getErrorMessage(err);
        this.submitError = msg || (this.editMode ? 'Failed to update course.' : 'Failed to publish. Is the course backend (courss-service on port 8081) running?');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.error('Course submit error:', err);
      }
    });
  }

  private getFirstInvalidStep(): 1 | 2 | 3 {
    const step1Invalid =
      !!this.courseForm.get('title')?.invalid ||
      !!this.courseForm.get('shortDescription')?.invalid ||
      !!this.courseForm.get('description')?.invalid ||
      !!this.courseForm.get('category')?.invalid ||
      !!this.courseForm.get('level')?.invalid;
    if (step1Invalid) return 1;
    if (this.getStructureErrors().length > 0) return 2;
    const step3Invalid = !!this.courseForm.get('price')?.invalid;
    return step3Invalid ? 3 : 1;
  }

  private getHumanValidationMessage(): string {
    const missing: string[] = [];
    const title = this.courseForm.get('title');
    if (title?.invalid) missing.push('Title (min 10 chars).');
    const shortHook = this.courseForm.get('shortDescription');
    if (shortHook?.invalid) missing.push('Short hook (required, max 150 chars).');
    const desc = this.courseForm.get('description');
    if (desc?.invalid) missing.push('Description (min 50 chars).');
    const cat = this.courseForm.get('category');
    if (cat?.invalid) missing.push('Category.');
    const lvl = this.courseForm.get('level');
    if (lvl?.invalid) missing.push('Level.');
    const price = this.courseForm.get('price');
    if (price?.invalid) missing.push('Price (≥ 0).');

    const structure = this.getStructureErrors();
    if (structure.length > 0) missing.push(`Structure: ${structure.join(' ')}`);

    return missing.length > 0
      ? `Please fix: ${missing.join(' ')}`
      : 'Please complete all required fields.';
  }

  private getStructureErrors(): string[] {
    const errors: string[] = [];
    const syllabus = this.syllabusFormArray;
    if (!syllabus || syllabus.length === 0) {
      errors.push('Add at least one section and one lesson.');
      return errors;
    }

    syllabus.controls.forEach((sectionCtrl, sIdx) => {
      const titleCtrl = (sectionCtrl as any).get?.('title');
      if (titleCtrl?.invalid) errors.push(`Section ${sIdx + 1} title is required.`);
      const lessons = (sectionCtrl as any).get?.('lessons') as FormArray | null;
      if (!lessons || lessons.length === 0) {
        errors.push(`Section ${sIdx + 1}: add at least one lesson.`);
        return;
      }
      lessons.controls.forEach((lessonCtrl, lIdx) => {
        const lessonTitle = (lessonCtrl as any).get?.('title');
        if (lessonTitle?.invalid) errors.push(`Section ${sIdx + 1}, Lesson ${lIdx + 1} title is required.`);
      });
    });

    return errors;
  }

  private logInvalidState(): void {
    try {
      const invalid: Record<string, any> = {};
      Object.keys(this.courseForm.controls).forEach((k) => {
        const c: any = (this.courseForm as any).get(k);
        if (c && c.invalid) invalid[k] = c.errors;
      });
      console.warn('[CourseCreation] Form invalid. currentStep=', this.currentStep, 'invalidControls=', invalid);
      const struct = this.getStructureErrors();
      if (struct.length > 0) console.warn('[CourseCreation] Structure errors:', struct);
    } catch {
      // no-op
    }
  }

  private getErrorMessage(err: any): string {
    if (!err) return '';
    // Network failure (backend not running / CORS / proxy)
    if (err.status === 0 || err.message === 'Http failure response')
      return 'Cannot reach course backend. Start MySQL and the Spring Boot app (courss-service on port 8081), then restart ng serve.';
    const body = err.error;
    if (body) {
      if (typeof body === 'string') return body;
      if (body.message) return body.message;
      if (body.error) return [body.error, body.message].filter(Boolean).join(': ');
      // Validation: errors as array or as map (field -> message)
      if (body.errors) {
        if (Array.isArray(body.errors))
          return `Validation: ${body.errors.map((e: any) => e.defaultMessage || e.message).join('; ')}`;
        const entries = Object.entries(body.errors).map(([k, v]) => `${k}: ${v}`);
        return `Validation: ${entries.join('; ')}`;
      }
    }
    if (err.message) return err.message;
    if (err.status) return `Server error ${err.status}: ${err.statusText || 'Check backend console for details.'}`;
    return 'An error occurred. Check the backend (courss-service) console for the stack trace.';
  }

  /** Backend expects enum names (e.g. ENGLISH_LANGUAGE), not display values (e.g. "English Language"). */
  private toBackendCategory(displayValue: string): string {
    const entry = Object.entries(CourseCategory).find(([, v]) => v === displayValue);
    return entry ? entry[0] : displayValue;
  }

  private toBackendLevel(displayValue: string): string {
    const entry = Object.entries(CourseLevel).find(([, v]) => v === displayValue);
    return entry ? entry[0] : displayValue;
  }

  /** Backend only accepts VIDEO and PDF for lesson type. */
  private toBackendLessonType(type: string): string {
    const t = (type || 'video').toUpperCase();
    return t === 'PDF' ? 'PDF' : 'VIDEO';
  }

  /** Send Course Thumbnail to backend so it appears on course cards. Backend uses LONGTEXT for image. */
  private getImageForPayload(thumbnail: string | null | undefined): string {
    const v = thumbnail?.trim() || '';
    if (!v) return '';
    return v;
  }

  /** Build payload from form (labels: Course Title, Short Hook, Full Prospectus, etc.). Sent to backend on Publish Course → saved to database PI. */
  private buildPayload(publish: boolean): CreateCoursePayload {
    const formVal = this.courseForm.value;
    return {
      title: formVal.title ?? '',
      shortDescription: formVal.shortDescription ?? '',
      description: formVal.description ?? '',
      category: this.toBackendCategory(formVal.category ?? ''),
      level: this.toBackendLevel(formVal.level ?? ''),
      price: Number(formVal.price) ?? 0,
      image: this.getImageForPayload(formVal.image), // Course Thumbnail → backend "image" (DB LONGTEXT)
      isPublished: publish,
      language: 'English',
      syllabus: ((formVal.syllabus || []) as Array<{ title?: string; lessons?: Array<{ title?: string; type?: string; fileName?: string; fileUrl?: string }> }>).map((section) => ({
        title: section.title ?? '',
        lessons: (section.lessons || []).map((lesson) => ({
          title: lesson.title ?? '',
          type: this.toBackendLessonType(lesson.type ?? 'video'),
          isPreview: false,
          fileName: lesson.fileName ?? '',
          fileUrl: lesson.fileUrl ?? ''
        }))
      })),
      quizzes: (this.quizzes || []).map(q => ({
        title: q.title ?? 'Quiz',
        passingScore: q.passingScore ?? 70,
        questions: (q.questions || []).map(qu => ({
          text: qu.text ?? '',
          type: (qu.type ?? 'multiple_choice').toString().toUpperCase().replace(/ /g, '_'),
          options: qu.options ?? [],
          correctAnswer: Array.isArray(qu.correctAnswer) ? qu.correctAnswer[0] : (qu.correctAnswer ?? ''),
          explanation: qu.explanation ?? '',
          points: qu.points ?? 10
        }))
      }))
    };
  }
}
