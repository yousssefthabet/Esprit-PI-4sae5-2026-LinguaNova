import { Component, Input, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Course } from '../../../core/models/course.model';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

const DEFAULT_COURSE_IMAGE = APP_CONSTANTS.DEFAULT_COURSE_IMAGE;

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <!-- Course Thumbnail (from backend image) -->
      <div class="relative w-full aspect-video overflow-hidden bg-gray-100">
        <img 
          [src]="courseImageSrc" 
          [alt]="course.title"
          class="w-full h-full object-cover object-center"
          loading="lazy"
          (error)="onImageError()"
        />
        <!-- Tag Badge -->
        <div class="absolute top-4 left-4">
          <span class="bg-[#E0F2FE] text-[#0369A1] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {{ course.displayTag || 'Course' }}
          </span>
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-6 flex flex-col flex-1">
        <!-- Icon & Title -->
        <div class="flex items-start gap-3 mb-4">
          <div class="mt-1 text-[#0D9488]">
            @switch (course.iconType) {
              @case ('speech') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              @case ('pencil') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              }
              @case ('audio') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              }
              @case ('briefcase') {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              @default {
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
            }
          </div>
          <h3 class="font-bold text-xl text-gray-900 leading-snug">
            {{ course.title }}
          </h3>
        </div>
        
        <!-- Description -->
        <p class="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
          {{ course.description }}
        </p>
        
        <div class="mt-auto">
          <!-- Price -->
          <div class="mb-4">
            @if (course.discountedPrice) {
              <div class="flex items-center gap-2">
                <span class="text-gray-400 line-through font-medium text-lg">
                  {{ formatPrice(course.price) }} TND
                </span>
                <span class="text-2xl font-black text-gray-900">
                  {{ formatPrice(course.discountedPrice) }} TND
                </span>
              </div>
            } @else {
              <span class="text-2xl font-black text-gray-900">
                {{ formatPrice(course.price) }} TND
                @if (course.priceSuffix) {
                  <span class="text-base font-medium text-gray-400">{{ course.priceSuffix }}</span>
                }
              </span>
            }
          </div>
          
          <!-- CTA Button -->
          <button 
            type="button"
            class="w-full py-4 bg-[#0D9488] hover:bg-[#0D5E5B] text-white rounded-xl transition-all duration-300 font-bold flex items-center justify-center gap-2 group"
            (click)="onAction($event)"
          >
            @if (course.displayTag?.includes('Live')) {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book your place
            } @else {
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Purchase
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
  `]
})
export class CourseCardComponent implements OnChanges {
  private readonly router = inject(Router);
  @Input({ required: true }) course!: Course;
  imageLoadFailed = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['course']) this.imageLoadFailed = false;
  }

  get courseImageSrc(): string {
    if (this.imageLoadFailed) return DEFAULT_COURSE_IMAGE;
    const raw = this.course?.image;
    const url = typeof raw === 'string' ? raw.trim() : '';
    return url.length > 0 ? url : DEFAULT_COURSE_IMAGE;
  }

  onImageError(): void {
    this.imageLoadFailed = true;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('fr-TN');
  }

  onAction(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.router.navigate(['/courses', this.course.id]);
  }
}
