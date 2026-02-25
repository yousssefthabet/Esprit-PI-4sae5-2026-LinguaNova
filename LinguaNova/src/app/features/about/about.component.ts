import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TrainingCard {
  title: string;
  type: string;
  image: string;
}

interface ClubCard {
  title: string;
  description: string;
  image: string;
}

interface EventCard {
  title: string;
  description: string;
  image: string;
  badge: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white min-h-screen">
      
      <!-- 1. Hero Section -->
      <section class="px-6 pt-4 pb-0">
        <div class="max-w-[1440px] mx-auto relative h-[600px] md:h-[500px] rounded-[24px] overflow-hidden shadow-lg group">
          <!-- Background Image -->
          <img 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&auto=format&fit=crop" 
            alt="Community gathering" 
            class="absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-transform duration-1000 group-hover:scale-105"
          >
          
          <!-- Overlay Content -->
          <div class="absolute inset-0 flex items-center">
            <div class="container mx-auto px-12">
              <div class="max-w-3xl text-white">
                <h1 class="text-5xl lg:text-6xl font-black mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight tracking-tight">
                  Your Future Speaks English
                </h1>
                <p class="text-xl lg:text-2xl mb-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] font-medium text-white/95">
                  Step in and Let's start your English Journey
                </p>
                <button 
                  class="inline-flex items-center gap-2 px-8 py-4 bg-[#1E4D4A] border-none rounded-full text-white font-bold text-lg shadow-xl hover:bg-[#2D6F6B] hover:scale-105 transition-all duration-300"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 16l2 2 4-4" />
                  </svg>
                  Book an appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. What is Jungle Section -->
      <div class="px-6 mb-12">
        <section class="bg-[#F5FAF9] rounded-[24px] max-w-[1440px] mx-auto overflow-hidden">
          <div class="flex flex-col lg:flex-row h-[320px]">
            <!-- Left Column - Content (50%) -->
            <div class="lg:w-1/2 px-10 flex flex-col justify-center">
              <h2 class="text-[32px] font-black text-[#1F2937] mb-4 leading-tight tracking-tight">What is Jungle in English ?</h2>
              <p class="text-lg text-[#6B7280] leading-relaxed max-w-lg font-medium">
                Jungle In English est l'académie dont vous avez besoin pour améliorer votre anglais et vous débarrasser des difficultés que vous avez toujours eues.
              </p>
            </div>
            
            <!-- Right Column - Large Image (50%) -->
            <div class="lg:w-1/2 relative h-full">
              <div class="w-full h-full relative">
                <!-- Browser Header Mockup (Integrated) -->
                <div class="absolute top-0 left-0 right-0 z-20 bg-white/40 backdrop-blur-md px-4 py-3 flex gap-1.5 items-center border-b border-white/20">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></div>
                  <div class="w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                </div>
                
                <img 
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop" 
                  alt="Enthusiastic Student" 
                  class="w-full h-full object-cover object-top transition-transform hover:scale-105 duration-1000"
                >
                
                <!-- Floating Action Icons (Scaled Down) -->
                <div class="absolute inset-y-0 right-8 flex flex-col justify-center gap-4 z-10">
                  <div class="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-[#EC4899] hover:scale-110 transition-transform cursor-pointer">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                  <div class="w-10 h-10 bg-white shadow-xl rounded-xl flex items-center justify-center text-[#EC4899] hover:scale-110 transition-transform cursor-pointer">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                    </svg>
                  </div>
                </div>

                <!-- Live Status Badge -->
                <div class="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white flex items-center gap-1.5 z-10">
                  <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span class="text-[9px] font-black uppercase tracking-widest">Connect with our community</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- 3. Statistics Bar -->
      <section class="bg-[#2D6F6B] py-16">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center text-white">
            <div>
              <div class="text-[42px] font-bold mb-1">200K+</div>
              <div class="text-white/80 font-medium tracking-wide">Enrolled Users</div>
            </div>
            <div>
              <div class="text-[42px] font-bold mb-1">10K+</div>
              <div class="text-white/80 font-medium tracking-wide">E-mails</div>
            </div>
            <div>
              <div class="text-[42px] font-bold mb-1">50+</div>
              <div class="text-white/80 font-medium tracking-wide">Trainers</div>
            </div>
            <div>
              <div class="text-[42px] font-bold mb-1">80K+</div>
              <div class="text-white/80 font-medium tracking-wide">Magazine Readers</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Our Trainings -->
      <section class="py-24 bg-white overflow-hidden">
        <div class="container mx-auto px-4 max-w-7xl relative">
          <div class="mb-12">
            <h2 class="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Trainings</h2>
            <p class="text-gray-500 max-w-lg mb-4 leading-relaxed font-medium">
              All the training we available on line and face to face, in groups and individually.
            </p>
            <a href="#" class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:translate-x-1 transition-transform">
              Learn more
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <!-- Carousel Controls -->
          <div class="absolute right-4 top-0 flex gap-3">
            <button class="w-12 h-12 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button class="w-12 h-12 rounded-lg bg-[#2D6F6B] flex items-center justify-center text-white shadow-lg shadow-[#2D6F6B]/20">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- Training Cards -->
          <div class="flex gap-8">
            @for (t of trainingCards; track t.title) {
              <div class="w-full md:w-[450px] flex-shrink-0 group cursor-pointer">
                <div class="relative aspect-video rounded-3xl overflow-hidden mb-6 shadow-sm">
                  <img [src]="t.image" [alt]="t.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#2D6F6B] transition-colors leading-snug">
                  {{ t.title }}
                </h3>
                <div class="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-widest">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {{ t.type }}
                </div>
              </div>
            }
          </div>

          <!-- Dot Indictors -->
          <div class="flex justify-center mt-12 gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-[#2D6F6B]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      <!-- 5. Our Clubs -->
      <section class="py-24 bg-[#F8FAFC]">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="flex justify-between items-end mb-12">
            <div>
              <h2 class="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Our Clubs</h2>
              <p class="text-gray-500 max-w-lg leading-relaxed font-medium">
                Join our clubs, and be part of a dynamic network that inspires learning, creativity, and fun!
              </p>
            </div>
            <a href="#" class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:translate-x-1 transition-transform">
              Show all
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            @for (c of clubCards; track c.title) {
              <div class="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-gray-100/50">
                <div class="relative h-[220px] rounded-2xl overflow-hidden mb-6">
                  <img [src]="c.image" [alt]="c.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">{{ c.title }}</h3>
                <p class="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                  {{ c.description }}
                </p>
                <a href="#" class="inline-flex items-center gap-2 text-gray-900 font-black text-sm group-hover:text-[#2D6F6B] transition-colors">
                  Read more
                  <svg class="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            }
          </div>

          <!-- Dot Indictors -->
          <div class="flex justify-center mt-12 gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-[#2D6F6B]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      <!-- 6. Our Events -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-4 max-w-7xl relative">
          <div class="flex justify-between items-end mb-12">
            <div>
              <h2 class="text-[32px] font-bold text-[#2D6F6B] mb-2 uppercase tracking-tight">Our Events</h2>
              <p class="text-gray-500 leading-relaxed font-medium">
                All the training are available online and face to face, in groups and individually.
              </p>
            </div>
            <a href="#" class="inline-flex items-center gap-2 text-[#2D6F6B] font-bold hover:translate-x-1 transition-transform">
              Show all
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (e of eventCards; track e.title) {
              <div class="bg-white border border-gray-100 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer">
                <div class="relative aspect-[4/3]">
                  <img [src]="e.image" [alt]="e.title" class="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700">
                  <div class="absolute top-4 left-4 bg-[#E0F7FA] text-[#00ACC1] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                    <div class="w-1.5 h-1.5 rounded-full bg-[#00ACC1]"></div>
                    {{ e.badge }}
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-[#1E293B] mb-2 line-clamp-2 leading-[1.3] group-hover:text-[#2D6F6B] transition-colors">{{ e.title }}</h3>
                  <p class="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-3 font-medium">
                    {{ e.description }}
                  </p>
                  <a href="#" class="inline-flex items-center gap-1.5 text-black font-black text-[13px] hover:text-[#2D6F6B] transition-colors uppercase tracking-wider">
                    Consult
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 00-2 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 20" />
                    </svg>
                  </a>
                </div>
              </div>
            }
          </div>

          <!-- Dot Indictors -->
          <div class="flex justify-center mt-12 gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-[#2D6F6B]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      <!-- 7. Why Jungle In English Section -->
      <section class="py-24 bg-[#F8FAFC]">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="text-center mb-16">
            <h2 class="text-4xl font-bold text-[#2D6F6B] mb-4 tracking-tight">Why Jungle In English ✨</h2>
            <p class="text-gray-500 font-medium">
              All the training are available online and face to face, in groups and individually.
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8 items-center">
            <!-- Left Card -->
            <div class="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-500">
              <div class="w-20 h-20 rounded-full border-2 border-[#2D6F6D] flex items-center justify-center text-[#2D6F6D] mb-8">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Build Your Weakness</h3>
              <p class="text-gray-500 leading-relaxed font-medium">
                Full scope l'have où disposif et programs network with impartant lexique creativity, and fun!
              </p>
            </div>

            <!-- Featured Middle Card -->
            <div class="bg-[#2D6F6B] p-14 rounded-[40px] shadow-[0_35px_60px_-15px_rgba(45,111,107,0.4)] flex flex-col items-center text-center transform lg:scale-110 lg:-translate-y-4 z-10 transition-transform duration-500 hover:scale-[1.12]">
              <div class="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center text-white mb-8">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.879 16.121A3 3 0 1012.015 11L11 14a4.5 4.5 0 000 3.033" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Fuel Your Passion</h3>
              <p class="text-white/90 leading-relaxed font-medium">
                Connect with like- minded people-join not just our community but with club.
              </p>
            </div>

            <!-- Right Card -->
            <div class="bg-white p-12 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-500">
              <div class="w-20 h-20 rounded-full border-2 border-[#2D6F6D] flex items-center justify-center text-[#2D6F6D] mb-8">
                <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-gray-900 mb-4">Unleash Your Creativity</h3>
              <p class="text-gray-500 leading-relaxed font-medium">
                Join fun service activities where ideas that the at fun, innovation takes on the clubs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Student Feedback Section -->
      <section class="py-24 bg-white">
        <div class="container mx-auto px-4 max-w-7xl text-center">
          <div class="mb-16">
            <h2 class="text-4xl font-bold text-[#2D6F6B] mb-4 tracking-tight">Student Feedback ⭐</h2>
            <p class="text-gray-500 font-medium">
               All the training are available online and face to face, in groups and individually.
            </p>
          </div>

          <div class="grid md:grid-cols-2 gap-12 text-left">
            @for (f of feedbacks; track f.name) {
              <div class="bg-white p-12 rounded-[40px] border border-gray-100 shadow-sm relative hover:shadow-2xl transition-shadow duration-700">
                <div class="flex items-start justify-between mb-8">
                  <div class="flex items-center gap-4">
                    <img [src]="f.image" [alt]="f.name" class="w-20 h-20 rounded-full object-cover shadow-inner">
                    <div>
                      <h4 class="font-black text-gray-900 text-xl tracking-tight">{{ f.name }}</h4>
                      <p class="text-[#2D6F6B] text-sm font-black uppercase tracking-widest mt-0.5">{{ f.role }}</p>
                    </div>
                  </div>
                  <div class="text-[#2D6F6B] opacity-[0.15] transform translate-y-[-15px]">
                    <svg class="w-24 h-24 fill-current" viewBox="0 0 24 24">
                      <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14H15.017C14.4647 14 14.017 13.5523 14.017 13V11C14.017 10.4477 14.4647 10 15.017 10H19.017C20.1216 10 21.017 10.8954 21.017 12V18C21.017 19.6569 19.6739 21 18.017 21H14.017ZM3.0166 21L3.0166 18C3.0166 16.8954 3.91203 16 5.0166 16H8.0166V14H4.0166C3.46432 14 3.0166 13.5523 3.0166 13V11C3.0166 10.4477 3.46432 10 4.0166 10H8.0166C9.12117 10 10.0166 10.8954 10.0166 12V18C10.0166 19.6569 8.67345 21 7.0166 21H3.0166Z" />
                    </svg>
                  </div>
                </div>
                <p class="text-gray-700 text-xl leading-relaxed font-medium italic">
                  "{{ f.text }}"
                </p>
              </div>
            }
          </div>

          <!-- Dot Indictors -->
          <div class="flex justify-center mt-12 gap-2">
            <div class="w-2.5 h-2.5 rounded-full bg-[#2D6F6B]"></div>
            <div class="w-2.5 h-2.5 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </section>

      <!-- 9. Our Instructors Section -->
      <section class="py-24 bg-[#F8FAFC]">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="mb-16">
            <h2 class="text-4xl font-bold text-[#2D6F6B] mb-6 tracking-tight text-center lg:text-left">Our Instructors ✨</h2>
            <p class="text-gray-500 max-w-4xl text-xl leading-relaxed font-medium text-center lg:text-left mx-auto lg:mx-0">
              They bring learning to life with engaging lessons and personalized guidance. From grammar to fluency, our instructors are here to support your journey every step of the way.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <!-- Left Tall Card -->
            <div class="md:col-span-1 md:row-span-2 group cursor-pointer lg:-translate-y-4">
              <div class="rounded-[32px] overflow-hidden mb-8 h-[550px] shadow-sm hover:shadow-2xl transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
              </div>
              <div class="px-2">
                <h4 class="text-2xl font-black text-gray-900 tracking-tight">David Richards</h4>
                <p class="text-[#2D6F6B] font-black uppercase tracking-[0.2em] text-[10px] mt-1">Business English Expert Scotland</p>
              </div>
            </div>

            <!-- Middle Column -->
            <div class="md:col-span-2 space-y-16">
              <div class="group cursor-pointer">
                <div class="px-2 mb-6">
                  <h4 class="text-2xl font-black text-gray-900 tracking-tight mb-1">Saatva Abdu</h4>
                  <p class="text-[#2D6F6B] font-black uppercase tracking-[0.2em] text-[10px]">English For Academic Purposes Behind</p>
                </div>
                <div class="rounded-[32px] overflow-hidden h-[240px] shadow-sm hover:shadow-2xl transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=800&auto=format&fit=crop" class="w-full h-full object-cover group-hover:scale-110 duration-1000">
                </div>
              </div>
              <div class="group cursor-pointer">
                <div class="rounded-[32px] overflow-hidden h-[240px] mb-8 shadow-sm hover:shadow-2xl transition-all duration-700">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
                </div>
                <div class="px-2">
                  <h4 class="text-2xl font-black text-gray-900 tracking-tight">Michael Lee</h4>
                  <p class="text-[#2D6F6B] font-black uppercase tracking-[0.2em] text-[10px] mt-1">English Pronunciation & Accent Reduction</p>
                </div>
              </div>
            </div>

            <!-- Right Tall Card -->
            <div class="md:col-span-1 md:row-span-2 flex flex-col group cursor-pointer lg:translate-y-12">
              <div class="px-2 mb-6 text-right lg:translate-y-[-20px]">
                <h4 class="text-2xl font-black text-gray-900 tracking-tight mb-1">Emily Watson</h4>
                <p class="text-[#2D6F6B] font-black uppercase tracking-[0.2em] text-[10px]">Academic Writing Specialist</p>
              </div>
              <div class="rounded-[32px] overflow-hidden mb-10 h-[420px] shadow-sm hover:shadow-2xl transition-all duration-700">
                <img src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
              </div>
              <div class="rounded-[32px] overflow-hidden h-[280px] shadow-sm hover:shadow-2xl transition-all duration-700 mt-auto">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 10. Contact Us Section -->
      <section class="py-24 bg-white" id="contact">
        <div class="container mx-auto px-4 max-w-7xl">
          <div class="flex flex-col lg:flex-row gap-20 lg:gap-32">
            <!-- Form Left -->
            <div class="lg:w-1/2">
              <h2 class="text-[40px] font-black text-[#2D6F6B] mb-6 tracking-tighter">Contact Us</h2>
              <p class="text-gray-500 text-xl leading-relaxed mb-12 font-medium">
                Have questions or need assistance? Feel free to reach out to us! Our team is here to help you on your learning journey.
              </p>

              <form class="space-y-8">
                <div class="space-y-3">
                  <label class="block text-gray-900 font-black text-sm uppercase tracking-widest">Full name</label>
                  <input type="text" placeholder="Your name" class="w-full px-6 py-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2D6F6B]/10 focus:bg-white outline-none transition-all font-medium">
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div class="space-y-3">
                    <label class="block text-gray-900 font-black text-sm uppercase tracking-widest">Email</label>
                    <input type="email" placeholder="Your email" class="w-full px-6 py-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2D6F6B]/10 focus:bg-white outline-none transition-all font-medium">
                  </div>
                  <div class="space-y-3">
                    <label class="block text-gray-900 font-black text-sm uppercase tracking-widest">Phone number</label>
                    <input type="tel" placeholder="Your phone" class="w-full px-6 py-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2D6F6B]/10 focus:bg-white outline-none transition-all font-medium">
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="block text-gray-900 font-black text-sm uppercase tracking-widest">Subject</label>
                  <input type="text" placeholder="Write subject" class="w-full px-6 py-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2D6F6B]/10 focus:bg-white outline-none transition-all font-medium">
                </div>

                <div class="space-y-3">
                  <label class="block text-gray-900 font-black text-sm uppercase tracking-widest">Your Message</label>
                  <textarea rows="5" placeholder="Message here" class="w-full px-6 py-5 bg-[#F9FAFB] border border-gray-100 rounded-2xl focus:ring-4 focus:ring-[#2D6F6B]/10 focus:bg-white outline-none transition-all resize-none font-medium"></textarea>
                </div>

                <div class="pt-4">
                  <button type="submit" class="bg-[#2D6F6B] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-[#2D6F6B]/40 hover:bg-[#1E4D4A] transition-all hover:-translate-y-1 active:scale-95">
                    SEND MESSAGE
                  </button>
                </div>
              </form>
            </div>

            <!-- Image Right -->
            <div class="lg:w-1/2 flex items-center">
              <div class="relative w-full aspect-[4/5] bg-[#F3F4F6] rounded-[48px] p-6 group overflow-hidden shadow-inner border border-gray-50">
                 <!-- Browser UI Mockup -->
                <div class="bg-white/80 backdrop-blur-md px-6 py-3 rounded-t-[40px] border-b border-gray-100/50 flex items-center absolute top-6 left-6 right-6 z-10">
                  <div class="flex gap-2">
                    <div class="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                    <div class="w-3 h-3 rounded-full bg-[#10B981]"></div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop" 
                  alt="Contact Us" 
                  class="w-full h-full object-cover rounded-[36px] group-hover:scale-110 transition-transform duration-[2000ms] brightness-105"
                >
                <div class="absolute bottom-12 right-12 bg-white/20 backdrop-blur-lg p-6 rounded-3xl border border-white/30 text-white shadow-2xl">
                   <div class="flex items-center gap-3">
                      <div class="w-4 h-4 rounded-full bg-green-400 animate-pulse"></div>
                      <span class="font-black text-sm uppercase tracking-widest">Available now</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  `]
})
export class AboutComponent implements OnInit {
  trainingCards: TrainingCard[] = [
    {
      title: 'Mastering English: From Beginner to Fluent',
      type: 'Hybrid',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop'
    },
    {
      title: 'Everyday English for Real-Life Conversations',
      type: 'Hybrid',
      image: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?w=800&auto=format&fit=crop'
    }
  ];

  clubCards: ClubCard[] = [
    {
      title: 'Explore New Horizons',
      description: "Join a club today and master it in a dynamic community! It's about fun, learning, creativity, top vibes.",
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&auto=format&fit=crop'
    },
    {
      title: 'Fuel Your Passion',
      description: 'Connect w/ like-minded people, gain to have your English with our club.',
      image: 'https://images.unsplash.com/photo-1523240715181-2f0f9f20dd98?w=800&auto=format&fit=crop'
    },
    {
      title: 'Unleash Your Creativity',
      description: 'Dive into inject activities where trend, tips and features, make every majo...',
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop'
    }
  ];

  eventCards: EventCard[] = [
    {
      title: 'Speak Up: Live English Conversation Session',
      description: 'Join a live rally and interact of l spanish learners our culture loving, chatting and bol.',
      badge: 'Live classes',
      image: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=800&auto=format&fit=crop'
    },
    {
      title: 'Drama English: Interactive Workshop',
      badge: 'On going',
      description: 'Perfect with techniques Impersonate deja vu que personas or speaker.',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop'
    },
    {
      title: 'Mastering Accents & Pronunciation Clinic',
      badge: 'Blended',
      description: 'Tied to au crispy accent skills deep that the your pronouciation skills large.',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop'
    },
    {
      title: 'English Quiz Night: Siklai',
      badge: 'Blended',
      description: "Challenge you in a fun way it's time cra...",
      image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800&auto=format&fit=crop'
    }
  ];

  feedbacks: Testimonial[] = [
    {
      name: 'Maryam Bouattaoui',
      role: 'Product Owner',
      text: 'Joining this academy was pivotal, which helped me refine my business English. I now communicate more effectively with clients and stakeholders!',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format'
    },
    {
      name: 'Nour Ghidaoui',
      role: 'Human Resources',
      text: 'Joining this academy was pivotal, which helped me refine business English. I now communicate more effectively with Life and stakeholders!',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&auto=format'
    }
  ];

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
