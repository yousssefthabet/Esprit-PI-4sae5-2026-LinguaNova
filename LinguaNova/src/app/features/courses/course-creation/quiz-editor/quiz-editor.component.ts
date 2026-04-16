import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Quiz, Question } from '../../../../core/models/quiz.model';

@Component({
  selector: 'app-quiz-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-10">
      <!-- Quiz Meta -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div class="md:col-span-8 lg:col-span-9 flex flex-col gap-2">
          <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Assessment Label</label>
          <input type="text" [(ngModel)]="quiz.title" (ngModelChange)="onQuizChange()"
            class="px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 font-black placeholder:text-gray-300 shadow-sm outline-none" 
            placeholder="e.g. Theoretical Foundations Quiz" />
        </div>
        
        <div class="md:col-span-4 lg:col-span-3 flex flex-col gap-2">
          <label class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-1">Threshold (%)</label>
          <div class="relative">
             <input type="number" [(ngModel)]="quiz.passingScore" (ngModelChange)="onQuizChange()"
               class="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-[#0D9488] transition-all text-gray-900 font-black outline-none shadow-sm" />
             <span class="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 font-black">%</span>
          </div>
        </div>
      </div>

      <!-- Question List -->
      <div class="space-y-6">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
          <div>
             <h3 class="font-black text-gray-900 tracking-tight text-lg uppercase tracking-wider">Evaluation Bank</h3>
             <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{{ quiz.questions.length }} validated items</p>
          </div>
          <button type="button" (click)="addQuestion()" class="px-5 py-2.5 bg-[#0D9488] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-teal-100 hover:bg-[#0D5E5B] transition-all active:scale-[0.98]">
             + Add Question
          </button>
        </div>

        <div class="space-y-6">
          @for (q of quiz.questions; track q.id; let i = $index) {
            <div class="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 relative group/q hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-300">
              <button type="button" (click)="removeQuestion(i)" class="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
              
              <div class="flex flex-col gap-6">
                <!-- Question Text -->
                <div class="space-y-2">
                   <span class="text-[9px] font-black text-[#0D9488] uppercase tracking-[0.2em] ml-1">Question #{{ i + 1 }}</span>
                   <textarea [(ngModel)]="q.text" (ngModelChange)="onQuizChange()" rows="2"
                    class="w-full text-xl font-bold bg-transparent border-none border-b-2 border-gray-50 focus:border-[#0D9488] outline-none py-2 transition-colors placeholder:text-gray-200 text-gray-900"
                    placeholder="Enter enquiry content..."></textarea>
                </div>
                  
                <!-- Options -->
                <div class="space-y-3">
                  <span class="text-[9px] font-black text-gray-300 uppercase tracking-widest ml-1 mb-2 block">Available Responses</span>
                  @for (opt of q.options; track $index) {
                    <div class="flex items-center gap-4 group/opt">
                      <div class="relative w-5 h-5 shrink-0 ml-1">
                        <input type="radio" [name]="'correct-' + q.id" [value]="opt" 
                          [(ngModel)]="q.correctAnswer" (ngModelChange)="onQuizChange()"
                          class="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                        <div class="w-5 h-5 rounded-full border-2 border-gray-200 peer-checked:bg-green-500 peer-checked:border-green-500 transition-all"></div>
                        <div class="absolute inset-1.5 bg-white rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                      </div>
                      
                      <input type="text" [(ngModel)]="q.options[$index]" (ngModelChange)="onQuizChange()"
                        class="flex-1 px-5 py-3 rounded-2xl bg-white border border-gray-50 focus:ring-4 focus:ring-teal-500/5 focus:border-teal-200 text-sm font-medium text-gray-700 shadow-sm transition-all"
                        placeholder="Option text..." />
                      
                      <button type="button" (click)="removeOption(i, $index)" class="opacity-0 group-hover/opt:opacity-100 text-gray-300 hover:text-red-500 transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" /></svg>
                      </button>
                    </div>
                  }
                  
                  <div class="pt-2 pl-9">
                    <button type="button" (click)="addOption(i)" class="text-[10px] font-black text-[#0D9488] uppercase tracking-widest hover:underline">+ New Option</button>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    :host { display: block; }
  `]
})
export class QuizEditorComponent {
  @Input() quiz!: Quiz;
  @Output() quizChange = new EventEmitter<Quiz>();

  onQuizChange() {
    this.quizChange.emit(this.quiz);
  }

  addQuestion() {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: '',
      type: 'single_choice',
      options: ['Option A', 'Option B'],
      correctAnswer: 'Option A',
      points: 10
    };
    this.quiz.questions.push(newQuestion);
    this.onQuizChange();
  }

  removeQuestion(index: number) {
    this.quiz.questions.splice(index, 1);
    this.onQuizChange();
  }

  addOption(qIndex: number) {
    const nextChar = String.fromCharCode(65 + this.quiz.questions[qIndex].options.length);
    this.quiz.questions[qIndex].options.push(`Option ${nextChar}`);
    this.onQuizChange();
  }

  removeOption(qIndex: number, optIndex: number) {
    if (this.quiz.questions[qIndex].options.length > 2) {
      this.quiz.questions[qIndex].options.splice(optIndex, 1);
      this.onQuizChange();
    }
  }
}
