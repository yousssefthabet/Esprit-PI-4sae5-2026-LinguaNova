import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="px-6 pt-2 sticky top-0 z-50">
      <nav class="bg-[#2D6F6B] rounded-[16px] px-8 py-3 shadow-lg max-w-[1440px] mx-auto transition-all duration-300">
        <div class="flex items-center justify-between h-[50px]">
          
          <!-- Left Section: Logo & Navigation (60% width) -->
          <div class="flex items-center gap-14 w-full lg:w-3/5">
            <!-- Logo -->
            @if (user$ | async; as user) {
              <a [routerLink]="[getDashboardRoute(user)]" class="text-white font-bold text-xl whitespace-nowrap tracking-tight transition-opacity hover:opacity-90">
                LinguaNova
              </a>
            } @else {
              <a [routerLink]="['/']" class="text-white font-bold text-xl whitespace-nowrap tracking-tight transition-opacity hover:opacity-90">
                LinguaNova
              </a>
            }

            <!-- Navigation Menu -->
            <div class="hidden md:flex items-center gap-8">
              @for (item of navItems; track item.label) {
                <a 
                  [routerLink]="[item.route]" 
                  routerLinkActive="text-white font-semibold"
                  class="text-white/70 hover:text-white transition-all font-medium text-[15px] tracking-wide"
                >
                  {{ item.label }}
                </a>
              }
              @if (user$ | async; as user) {
                @if (user.role === UserRole.STUDENT) {
                  <a
                    routerLink="/mes-notes"
                    routerLinkActive="text-white font-semibold"
                    class="text-white/70 hover:text-white transition-all font-medium text-[15px] tracking-wide"
                  >
                    Mes notes
                  </a>
                }
              }
              @if (user$ | async; as user) {
                @if (user.role === UserRole.INSTRUCTOR) {
                  <a
                    routerLink="/examens"
                    routerLinkActive="text-white font-semibold"
                    class="text-white/70 hover:text-white transition-all font-medium text-[15px] tracking-wide"
                  >
                    Gestion
                  </a>
                }
              }
            </div>
          </div>

          <!-- Right Section: Action Buttons (40% width) -->
          <div class="hidden md:flex items-center gap-3 w-full lg:w-2/5 justify-end">
            <!-- Student/Teacher Space Button -->
            <!-- Visible ONLY when logged in, or defaulting to Student Space if preferred. 
                 Since we have a profile dropdown for Login when logged out, 
                 we might want to hide this or make it a CTA. 
                 I will make it dynamic based on user role. -->
            @if (user$ | async; as user) {
               <button 
                [routerLink]="getDashboardRoute(user)"
                class="flex items-center gap-2 px-6 py-2.5 border border-white/80 rounded-full text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {{ getSpaceLabel(user) }}
              </button>
            } @else {
              <a 
                routerLink="/auth/login"
                class="flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-[#2D6F6B] text-sm font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Login
              </a>
            }

            <!-- Contact Button -->
            <button 
              class="flex items-center gap-2 px-6 py-2.5 bg-white rounded-full text-[#2D6F6B] text-sm font-semibold hover:bg-gray-50 transition-all duration-200 shadow-sm"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Contact
            </button>

            <!-- Profile Dropdown (Logged In) -->
            @if (user$ | async; as user) {
              <div class="relative group">
                <button 
                  class="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-[#2D6F6B] text-sm font-bold hover:bg-gray-50 transition-all duration-200 shadow-sm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                  <svg class="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                <div class="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50 border border-gray-100">
                  <a 
                    [routerLink]="getProfileRoute(user)"
                    class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-teal-50 hover:text-[#2D6F6B] transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </a>
                  <button 
                    (click)="logout()"
                    class="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            } @else {
              <!-- Language Selector (Visible only when logged out) -->
              <button 
                class="flex items-center gap-2 px-4 py-2.5 bg-white rounded-full text-[#2D6F6B] text-sm font-bold hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9h18" />
                </svg>
                EN
              </button>
            }
          </div>

          <!-- Mobile Menu Button -->
          <button class="md:hidden p-2 text-white" (click)="mobileMenuOpen = !mobileMenuOpen">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>

        <!-- Mobile Menu Expansion -->
        @if (mobileMenuOpen) {
          <div class="md:hidden py-6 border-t border-white/10 mt-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div class="flex flex-col gap-5 text-center">
              @for (item of navItems; track item.label) {
                <a 
                  [routerLink]="[item.route]" 
                  (click)="mobileMenuOpen = false" 
                  class="text-white/80 hover:text-white font-medium text-lg"
                >
                  {{ item.label }}
                </a>
              }
              @if (user$ | async; as user) {
                @if (user.role === UserRole.STUDENT) {
                  <a
                    routerLink="/mes-notes"
                    (click)="mobileMenuOpen = false"
                    class="text-white/80 hover:text-white font-medium text-lg"
                  >
                    Mes notes
                  </a>
                }
              }
              @if (user$ | async; as user) {
                @if (user.role === UserRole.INSTRUCTOR) {
                  <a
                    routerLink="/examens"
                    (click)="mobileMenuOpen = false"
                    class="text-white/80 hover:text-white font-medium text-lg"
                  >
                    Gestion
                  </a>
                }
              }
              <div class="flex flex-col gap-3 pt-4 border-t border-white/10">
                @if (user$ | async; as user) {
                  <button [routerLink]="getProfileRoute(user)" (click)="mobileMenuOpen = false" class="w-full py-3 border border-white/60 rounded-full text-white font-semibold">
                    Profile
                  </button>
                  <button [routerLink]="getDashboardRoute(user)" (click)="mobileMenuOpen = false" class="w-full py-3 border border-white/60 rounded-full text-white font-semibold mt-2">
                    {{ getSpaceLabel(user) }}
                  </button>
                } @else {
                  <a routerLink="/auth/login" (click)="mobileMenuOpen = false" class="w-full py-3 bg-white rounded-full text-[#2D6F6B] font-bold flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Login
                  </a>
                }
                
                <button (click)="mobileMenuOpen = false" class="w-full py-3 bg-white rounded-full text-[#2D6F6B] font-bold">
                  Contact
                </button>
              </div>
            </div>
          </div>
        }
      </nav>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  protected readonly UserRole = UserRole;

  user$ = this.authService.currentUser$;
  mobileMenuOpen = false;

  navItems = [
    { label: 'About', route: '/about' },
    { label: 'Training', route: '/courses' },
    { label: 'Clubs', route: '/clubs' },
    { label: 'Events', route: '/events' },
    { label: 'Examens', route: '/examens' },
  ];

  getDashboardRoute(user: any): string {
    if (user?.role === UserRole.ADMIN) return '/admin/dashboard';
    if (user?.role === UserRole.INSTRUCTOR) return '/dashboard/instructor';
    return '/dashboard/student';
  }

  getProfileRoute(user: any): string {
    // Currently only student profile route is explicitly defined in routes
    // Mapping both to profile/student if usage is generic, or falling back to dashboard for instructor if separate route missing
    // User request: "go to the profile page". 
    // I will try '/profile/student' for student. For instructor, I'll assume '/profile/instructor' might be desired or just '/profile/student'?
    // Let's stick to what we know exists: '/profile/student'. 
    // If user is instructor, 'profile/student' might allow viewing their own profile?
    if (user?.role === UserRole.INSTRUCTOR) return '/profile/instructor';
    return '/profile/student';
  }

  getSpaceLabel(user: any): string {
    return user?.role === UserRole.INSTRUCTOR ? 'Teacher space' : 'Student space';
  }

  logout(): void {
    this.authService.logout();
  }
}
