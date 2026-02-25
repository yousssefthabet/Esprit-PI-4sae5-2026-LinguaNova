import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, AdminStats, Club } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { User, UserRole } from '../../../core/models/user.model';
import { Feedback } from '../../../core/models/feedback.model';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-[#F8FAFC] flex font-sans">
      <!-- Premium Sidebar -->
      <aside class="w-72 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 z-20 shadow-sm">
        <div class="p-8 pb-4">
          <div class="flex items-center gap-3 mb-10">
            <div class="w-10 h-10 bg-[#0D9488] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-100">
              <i-lucide name="shield-check" class="w-6 h-6"></i-lucide>
            </div>
            <div>
               <span class="text-xl font-black text-gray-900 tracking-tight block">LinguaAdmin</span>
               <span class="text-[10px] font-black text-[#0D9488] uppercase tracking-[0.2em] leading-none">Control Center</span>
            </div>
          </div>
          
          <nav class="space-y-1">
            <button 
              (click)="activeTab = 'dashboard'" 
              class="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group"
              [ngClass]="activeTab === 'dashboard' ? 'bg-teal-50 text-[#0D9488]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
            >
              <i-lucide name="layout" class="w-5 h-5 flex-shrink-0" [ngClass]="activeTab === 'dashboard' ? 'text-[#0D9488]' : 'group-hover:text-gray-600'"></i-lucide>
              <span class="text-sm font-bold uppercase tracking-wider">Overview</span>
            </button>
            
            <button 
              (click)="activeTab = 'users'" 
              class="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group"
              [ngClass]="activeTab === 'users' ? 'bg-teal-50 text-[#0D9488]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
            >
              <i-lucide name="users" class="w-5 h-5 flex-shrink-0" [ngClass]="activeTab === 'users' ? 'text-[#0D9488]' : 'group-hover:text-gray-600'"></i-lucide>
              <span class="text-sm font-bold uppercase tracking-wider">Students</span>
            </button>
            
            <button 
              (click)="activeTab = 'teachers'" 
              class="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group"
              [ngClass]="activeTab === 'teachers' ? 'bg-teal-50 text-[#0D9488]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
            >
              <i-lucide name="graduation-cap" class="w-5 h-5 flex-shrink-0" [ngClass]="activeTab === 'teachers' ? 'text-[#0D9488]' : 'group-hover:text-gray-600'"></i-lucide>
              <span class="text-sm font-bold uppercase tracking-wider">Instructors</span>
            </button>

            <button 
              (click)="activeTab = 'clubs'" 
              class="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group"
              [ngClass]="activeTab === 'clubs' ? 'bg-teal-50 text-[#0D9488]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
            >
              <i-lucide name="activity" class="w-5 h-5 flex-shrink-0" [ngClass]="activeTab === 'clubs' ? 'text-[#0D9488]' : 'group-hover:text-gray-600'"></i-lucide>
              <span class="text-sm font-bold uppercase tracking-wider">Clubs</span>
            </button>
            
            <button 
              (click)="activeTab = 'feedback'" 
              class="w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 group"
              [ngClass]="activeTab === 'feedback' ? 'bg-teal-50 text-[#0D9488]' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'"
            >
              <i-lucide name="message-square" class="w-5 h-5 flex-shrink-0" [ngClass]="activeTab === 'feedback' ? 'text-[#0D9488]' : 'group-hover:text-gray-600'"></i-lucide>
              <span class="text-sm font-bold uppercase tracking-wider">Audit</span>
            </button>
          </nav>
        </div>

        <div class="mt-auto p-6 border-t border-gray-50">
          <div class="flex items-center justify-between gap-4 px-2 mb-4">
            <div class="flex items-center gap-3">
              <div class="relative">
                <img src="https://i.pravatar.cc/100?u=admin" class="w-10 h-10 rounded-xl border-2 border-white shadow-sm" alt="Admin" />
                <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div class="overflow-hidden">
                <p class="text-sm font-black text-gray-900 truncate">System Master</p>
                <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Administrator</p>
              </div>
            </div>
          </div>
          <button 
            (click)="logout()"
            class="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all duration-300 group"
          >
            <i-lucide name="log-out" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i-lucide>
            <span class="text-xs font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      <!-- Main Command Center -->
      <main class="flex-1 p-8 lg:p-12 overflow-auto relative">
        <!-- Decoration -->
        <div class="absolute top-0 right-0 w-1/4 h-1/4 bg-gradient-to-bl from-teal-50/50 to-transparent pointer-events-none"></div>

        <div class="max-w-7xl mx-auto relative z-10">
          <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <div class="flex items-center gap-3 mb-2">
                 <span class="px-3 py-1 bg-teal-50 text-teal-700 text-[10px] font-black uppercase tracking-wider rounded-lg border border-teal-100">Governance</span>
                 <span class="text-gray-300">•</span>
                 <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ activeTab }} View</span>
              </div>
              <h1 class="text-4xl font-black text-gray-900 tracking-tight">{{ getTitle() }}</h1>
            </div>
            <div class="flex items-center gap-4">
               <button class="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#0D9488] hover:border-teal-100 transition-all shadow-sm">
                  <i-lucide name="bell" class="w-5 h-5"></i-lucide>
               </button>
               <button class="px-6 py-2.5 bg-white border border-gray-100 text-gray-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                  Export Log
               </button>
            </div>
          </header>

          <!-- DASHBOARD TAB -->
          <ng-container *ngIf="activeTab === 'dashboard'">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div class="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#0D9488] group-hover:scale-110 transition-transform">
                    <i-lucide name="users"></i-lucide>
                  </div>
                  <span class="text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">+{{ stats?.newUsersToday }} Today</span>
                </div>
                <p class="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">Elite Users</p>
                <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ stats?.totalUsers | number }}</h3>
              </div>

              <div class="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <i-lucide name="graduation-cap"></i-lucide>
                  </div>
                </div>
                <p class="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">Global Instructors</p>
                <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ stats?.totalInstructors | number }}</h3>
              </div>

              <div class="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <i-lucide name="book-open"></i-lucide>
                  </div>
                </div>
                <p class="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">Curriculum Assets</p>
                <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ stats?.activeCourses }}</h3>
              </div>

              <div class="bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:shadow-gray-200/40 transition-all group">
                <div class="flex items-center justify-between mb-4">
                  <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <i-lucide name="trending-up"></i-lucide>
                  </div>
                  <span class="text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1 rounded-full uppercase tracking-wider">{{ stats?.monthlyGrowth }}% Growth</span>
                </div>
                <p class="text-[11px] text-gray-400 font-black uppercase tracking-widest mb-1">Platform Revenue</p>
                <h3 class="text-3xl font-black text-gray-900 tracking-tight">{{ stats?.totalRevenue | currency }}</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div class="lg:col-span-8 bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/30 overflow-hidden">
                 <div class="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                   <div>
                      <h3 class="text-xl font-black text-gray-900 tracking-tight">Recent Onboarding</h3>
                      <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Latest system entrants</p>
                   </div>
                   <button (click)="activeTab = 'users'" class="text-[10px] font-black text-[#0D9488] uppercase tracking-widest hover:underline">Full Directory</button>
                 </div>
                 <div class="overflow-x-auto px-6 pb-6">
                   <table class="w-full text-left">
                     <thead>
                        <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                           <th class="px-4 py-6">Individual</th>
                           <th class="px-4 py-6">Domain</th>
                           <th class="px-4 py-6 text-right">Timestamp</th>
                        </tr>
                     </thead>
                     <tbody class="divide-y divide-gray-50">
                       <tr *ngFor="let user of users.slice(0, 5)" class="hover:bg-gray-50/50 transition-all group cursor-pointer">
                         <td class="px-4 py-6">
                           <div class="flex items-center gap-4">
                             <img [src]="user.avatar || 'https://i.pravatar.cc/100?u=' + user.id" class="w-10 h-10 rounded-xl border border-white shadow-sm" />
                             <span class="text-sm font-bold text-gray-800 transition-colors group-hover:text-[#0D9488]">{{ user.firstName }} {{ user.lastName }}</span>
                           </div>
                         </td>
                         <td class="px-4 py-6">
                            <span [class]="'px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ' + 
                              (user.role === 'student' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-teal-50 text-teal-600 border-teal-100')">
                               {{ user.role }}
                            </span>
                         </td>
                         <td class="px-4 py-6 text-xs text-gray-400 font-medium text-right font-mono">{{ user.createdAt | date:'MMM d, y' }}</td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
              </div>
              
              <div class="lg:col-span-4 bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/30 p-10 relative overflow-hidden">
                 <div class="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-bl-full pointer-events-none"></div>
                 
                 <div class="relative z-10 mb-10">
                    <h3 class="text-xl font-black text-gray-900 tracking-tight mb-1">System Feedback</h3>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sentiment Monitoring</p>
                 </div>

                 <div class="space-y-10 relative">
                   <div class="absolute left-3 top-2 bottom-2 w-0.5 border-l-2 border-dotted border-gray-100"></div>

                   <div *ngFor="let f of feedbacks.slice(0, 3)" class="relative pl-10 group/item">
                      <div class="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-white border-2 border-teal-50 shadow-sm flex items-center justify-center -translate-x-1.5 group-hover/item:scale-125 transition-transform">
                         <div class="w-1.5 h-1.5 bg-[#0D9488] rounded-full"></div>
                      </div>

                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs font-black text-gray-800 tracking-tight">{{ f.userName }}</span>
                        <div class="flex text-amber-400">
                          <i-lucide name="star" class="w-3 h-3 fill-current"></i-lucide>
                          <span class="ml-1 text-[9px] font-black text-gray-400">{{ f.rating }}</span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 font-medium leading-relaxed italic">"{{ f.comment }}"</p>
                   </div>
                 </div>

                 <button (click)="activeTab = 'feedback'" class="w-full mt-12 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all">Audit Insights</button>
              </div>
            </div>
          </ng-container>

          <!-- USERS/TEACHERS TAB -->
          <ng-container *ngIf="activeTab === 'users' || activeTab === 'teachers'">
            <div class="bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/30 overflow-hidden">
               <div class="px-10 py-8 border-b border-gray-50 bg-white/50 backdrop-blur-sm sticky top-0 z-10 flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-black text-gray-900 tracking-tight">{{ activeTab === 'users' ? 'Student Registry' : 'Instructor Faculty' }}</h3>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verified account management</p>
                  </div>
                  <div class="flex items-center gap-4">
                     <div class="relative">
                        <i-lucide name="search" class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"></i-lucide>
                        <input type="text" placeholder="Locate identity..." class="pl-11 pr-6 py-2.5 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-teal-500/10 transition-all outline-none" />
                     </div>
                  </div>
               </div>
               <div class="overflow-x-auto px-6 pb-6 mt-4">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50">
                        <th class="px-8 py-6">Subject Identity</th>
                        <th class="px-8 py-6">Validation Status</th>
                        <th class="px-8 py-6">Matriculation</th>
                        <th class="px-8 py-6 text-right">Security Settings</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr *ngFor="let user of getFilteredUsers()" class="hover:bg-gray-50/50 transition-all group">
                        <td class="px-8 py-6">
                          <div class="flex items-center gap-5">
                            <img [src]="user.avatar || 'https://i.pravatar.cc/100?u=' + user.id" class="w-12 h-12 rounded-[18px] border-2 border-white shadow-sm" />
                            <div>
                              <p class="text-sm font-black text-gray-900 group-hover:text-[#0D9488] transition-colors">{{ user.firstName }} {{ user.lastName }}</p>
                              <p class="text-[10px] font-bold text-gray-400 font-mono mt-0.5 tracking-tight">{{ user.email }}</p>
                            </div>
                          </div>
                        </td>
                        <td class="px-8 py-6">
                          <span [ngClass]="user.isActive ? 'text-green-700 bg-green-50 border-green-100' : 'text-gray-500 bg-gray-100 border-gray-200'" class="px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border">
                            {{ user.isActive ? 'Authorized' : 'Suspended' }}
                          </span>
                        </td>
                        <td class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          {{ user.createdAt | date:'longDate' }}
                        </td>
                        <td class="px-8 py-6 text-right">
                           <button 
                            (click)="toggleUser(user)" 
                            class="px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                            [ngClass]="user.isActive ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'"
                          >
                            {{ user.isActive ? 'Deprovision' : 'Reactive' }}
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
               </div>
            </div>
          </ng-container>

          <!-- CLUBS TAB -->
          <ng-container *ngIf="activeTab === 'clubs'">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div *ngFor="let club of clubs" class="bg-white rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/30 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-gray-200/40 transition-all group">
                  <div class="h-48 relative overflow-hidden">
                     <img [src]="club.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Club Cover" />
                     <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <span class="absolute bottom-6 left-6 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/20 flex items-center gap-2">
                        <span>{{ club.icon }}</span>
                        {{ club.category }}
                     </span>
                  </div>
                  <div class="p-8 flex-1 flex flex-col">
                     <div class="flex items-center gap-3 mb-4">
                        <div class="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#0D9488] font-bold border-2 border-white shadow-sm">
                           {{ club.instructorName.charAt(0) }}
                        </div>
                        <div>
                           <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Lead Architect</p>
                           <p class="text-xs font-bold text-gray-900">{{ club.instructorName }}</p>
                        </div>
                     </div>
                     <h3 class="text-xl font-black text-gray-900 tracking-tight mb-3 group-hover:text-[#0D9488] transition-colors leading-tight">{{ club.title }}</h3>
                     <p class="text-xs text-gray-500 font-medium mb-6 line-clamp-2 leading-relaxed italic">"{{ club.description }}"</p>
                     
                     <div class="mt-auto space-y-4">
                        <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span class="text-gray-400 flex items-center gap-2"><i-lucide name="users" class="w-3 h-3 text-teal-400"></i-lucide> {{ club.memberCount | number }} Members</span>
                           <span [class]="club.status === 'active' ? 'text-green-600 bg-green-50 border-green-100' : 'text-gray-400 bg-gray-50 border-gray-200'" class="px-3 py-1 rounded-lg border uppercase">{{ club.status }}</span>
                        </div>
                        <div class="flex gap-2">
                           <button class="flex-1 py-3 bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all">Moderate</button>
                           <button class="w-12 h-12 bg-white border border-gray-100 text-gray-400 flex items-center justify-center rounded-xl hover:text-[#0D9488] transition-all"><i-lucide name="settings" class="w-4 h-4"></i-lucide></button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </ng-container>

          <!-- FEEDBACK TAB -->
          <ng-container *ngIf="activeTab === 'feedback'">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div *ngFor="let f of feedbacks" class="bg-white p-10 rounded-[40px] border border-gray-50 shadow-xl shadow-gray-200/30 relative group overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform"></div>
                
                <div class="flex items-center justify-between mb-8 relative z-10">
                  <div class="flex items-center gap-4">
                     <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-300 border border-gray-100 shadow-sm shadow-gray-100/50 group-hover:text-[#0D9488] group-hover:border-teal-100 transition-all">
                      <i-lucide name="user" class="w-6 h-6"></i-lucide>
                     </div>
                     <div>
                       <p class="text-sm font-black text-gray-900 tracking-tight">{{ f.userName }}</p>
                       <p class="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-0.5">{{ f.createdAt | date:'mediumDate' }}</p>
                     </div>
                  </div>
                  <div class="flex text-amber-400">
                    <i-lucide *ngFor="let s of [1,2,3,4,5]" name="star" class="w-3.5 h-3.5" [ngClass]="s <= f.rating ? 'fill-current' : 'text-gray-100'"></i-lucide>
                  </div>
                </div>
                
                <p class="text-gray-600 text-sm font-medium leading-relaxed italic mb-8 relative z-10">"{{ f.comment }}"</p>
                
                <div *ngIf="f.courseName" class="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl relative z-10 border border-gray-50 group-hover:bg-white group-hover:border-teal-50 transition-all">
                  <div class="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[#0D9488]">
                     <i-lucide name="graduation-cap" class="w-4 h-4"></i-lucide>
                  </div>
                  <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ f.courseName }}</span>
                </div>
              </div>
            </div>
          </ng-container>
        </div>
      </main>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
    :host { display: block; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly authService = inject(AuthService);

  activeTab: 'dashboard' | 'users' | 'teachers' | 'feedback' | 'clubs' = 'dashboard';
  stats: AdminStats | null = null;
  users: User[] = [];
  feedbacks: Feedback[] = [];
  clubs: Club[] = [];

  ngOnInit(): void {
    this.adminService.getStats().subscribe(stats => this.stats = stats);
    this.adminService.getUsers().subscribe(users => this.users = users);
    this.adminService.getFeedbacks().subscribe(feedbacks => this.feedbacks = feedbacks);
    this.adminService.getClubs().subscribe(clubs => this.clubs = clubs);
  }

  getTitle(): string {
    switch (this.activeTab) {
      case 'dashboard': return 'Application Nexus';
      case 'users': return 'Student Registry';
      case 'teachers': return 'Faculty Command';
      case 'clubs': return 'Collaborative Circles';
      case 'feedback': return 'Semantic Insights';
      default: return 'Control Center';
    }
  }

  getFilteredUsers(): User[] {
    if (this.activeTab === 'users') {
      return this.users.filter(u => u.role === UserRole.STUDENT);
    } else if (this.activeTab === 'teachers') {
      return this.users.filter(u => u.role === UserRole.INSTRUCTOR);
    }
    return this.users;
  }

  toggleUser(user: User): void {
    this.adminService.toggleUserStatus(user.id).subscribe(() => {
      user.isActive = !user.isActive;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
