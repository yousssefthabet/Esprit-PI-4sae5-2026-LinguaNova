# TOTC E-Learning Platform - Angular 21

🎓 A modern, enterprise-grade e-learning platform built with Angular 21, standalone components, and TailwindCSS.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Development](#development)
- [Build](#build)
- [Architecture](#architecture)
- [Styling Approach](#styling-approach)
- [Components](#components)
- [Services](#services)

---

## ✨ Features

### Core Features
- ✅ **16 Feature Pages** - Complete application with all major pages
- ✅ **User Authentication** - Login, register, JWT token management
- ✅ **Course Management** - Browse, filter, enroll in courses
- ✅ **Blog System** - Read articles, browse categories
- ✅ **Dashboards** - Separate dashboards for students and instructors
- ✅ **Role-Based Access Control** - Protected routes with guards
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Dark Mode Ready** - Theme switching capability

### Technical Features
- ✅ **Angular 21** with standalone components
- ✅ **Lazy Loading** - All routes lazy-loaded for performance
- ✅ **TailwindCSS** - Utility-first styling (primary method)
- ✅ **SCSS Architecture** - Supplementary styling system
- ✅ **TypeScript** - Full type safety
- ✅ **RxJS State Management** - Reactive programming patterns
- ✅ **HTTP Interceptors** - Auth token injection & error handling
- ✅ **Route Guards** - Auth and role-based protection

---

## 🛠️ Tech Stack

### Core
- **Angular**: 21.1.0
- **TypeScript**: 5.9.2
- **RxJS**: 7.8.0

### Styling
- **TailwindCSS**: 3.4.19 (primary styling method)
- **SCSS**: Module-based architecture

### Development
- **Angular CLI**: 21.1.3
- **Build**: Angular esbuild application builder

---

## 📁 Project Structure

```
src/app/
├── core/                          # Core module (singleton services)
│   ├── constants/
│   │   └── app.constants.ts       # API endpoints, storage keys
│   ├── guards/
│   │   ├── auth.guard.ts          # Authentication guard
│   │   └── role.guard.ts          # Role-based access guard
│   ├── interceptors/
│   │   ├── auth.interceptor.ts    # JWT token injection
│   │   └── error.interceptor.ts   # Global error handling
│   ├── models/                    # TypeScript interfaces
│   │   ├── user.model.ts
│   │   ├── course.model.ts
│   │   ├── blog.model.ts
│   │   ├── event.model.ts
│   │   ├── notification.model.ts
│   │   └── common.model.ts
│   └── services/                  # Business logic services
│       ├── auth.service.ts
│       ├── course.service.ts
│       ├── blog.service.ts
│       ├── dashboard.service.ts
│       ├── event.service.ts
│       └── notification.service.ts
│
├── shared/                        # Shared components
│   ├── components/
│   │   ├── button/                # Reusable button component
│   │   ├── card/                  # Card container component
│   │   ├── input/                 # Form input with validation
│   │   ├── course-card/           # Course display card
│   │   └── blog-card/             # Blog post card
│   ├── pipes/
│   └── directives/
│
├── layout/                        # Layout components
│   ├── navbar/                    # Top navigation
│   ├── footer/                    # Footer
│   ├── profile-menu/              # User dropdown menu
│   ├── notifications-panel/       # Notifications dropdown
│   └── main-layout/               # Main layout wrapper
│
├── features/                      # Feature modules (lazy-loaded)
│   ├── home/landing/              # Landing page
│   ├── about/                     # About page
│   ├── auth/
│   │   ├── login/                 # Login page
│   │   └── register/              # Registration page
│   ├── courses/
│   │   ├── course-list/           # Course catalog
│   │   └── course-detail/         # Course details
│   ├── blog/
│   │   ├── blog-list/             # Blog listing
│   │   └── blog-detail/           # Blog post
│   ├── dashboard/
│   │   ├── student-dashboard/     # Student portal
│   │   └── instructor-dashboard/  # Instructor portal
│   ├── live-class/                # Live classroom
│   ├── events/event-creation/     # Create events
│   ├── calendar/                  # Calendar view
│   ├── checkout/                  # Payment checkout
│   ├── pricing/                   # Pricing plans
│   └── faq/                       # FAQ page
│
├── app.routes.ts                  # Route configuration
├── app.config.ts                  # App configuration
└── app.ts                         # Root component

src/styles/                        # SCSS architecture
├── abstracts/
│   └── _variables.scss            # CSS custom properties
├── base/
│   ├── _reset.scss                # CSS reset
│   ├── _typography.scss           # Typography base
│   └── _global.scss               # Global styles
├── themes/
│   ├── _light.theme.scss          # Light theme
│   └── _dark.theme.scss           # Dark theme
└── styles.scss                    # Main stylesheet
```

---

## 🚀 Installation

### Prerequisites
- Node.js 20.x or higher
- npm 11.x or higher

### Steps

1. **Clone the repository**
   ```bash
   cd "c:/Users/thabe/OneDrive/Desktop/PI project/LinguaNova"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **(Optional) Install additional packages** - if needed for full feature set:
   ```bash
   npm install @angular/cdk lucide-angular date-fns
   ```

---

## 💻 Development

### Start development server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

The application will automatically reload when you change source files.

### Available Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---------------|-------------|
| `/` | Landing | No | Homepage |
| `/about` | About | No | About page |
| `/auth/login` | Login | No | User login |
| `/auth/register` | Register | No | User registration |
| `/courses` | CourseList | No | Course catalog |
| `/courses/:id` | CourseDetail | No | Course details |
| `/blog` | BlogList | No | Blog posts |
| `/blog/:slug` | BlogDetail | No | Blog article |
| `/dashboard/student` | StudentDashboard | Yes | Student dashboard |
| `/dashboard/instructor` | InstructorDashboard | Yes (Instructor) | Instructor dashboard |
| `/live-class/:id` | LiveClass | Yes | Live classroom |
| `/event/create` | EventCreation | Yes | Create event |
| `/calendar` | Calendar | No | Events calendar |
| `/checkout` | Checkout | Yes | Payment checkout |
| `/pricing` | Pricing | No | Pricing plans |
| `/faq` | FAQ | No | FAQ |

---

## 🏗️ Build

### Production build
```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Build options
- Development: `ng build`
- Production: `ng build --configuration production`
- Watch mode: `npm run watch`

---

## 🏛️ Architecture

### Design Patterns

#### 1. **Standalone Components**
All components use Angular's standalone API - no NgModules required.

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: '...'
})
```

#### 2. **Smart/Dumb Components**
- **Smart Components** (Containers): Handle business logic, data fetching
- **Dumb Components** (Presentational): Pure display components

#### 3. **Service Layer**
- Singleton services in `core/services`
- Dependency injection via `inject()` function
- RxJS Observables for async operations

#### 4. **State Management**
- BehaviorSubject for reactive state
- No heavy state management library (NgRx) - keeps it simple

### Route Guards

#### AuthGuard
Protects routes requiring authentication.
```typescript
canActivate: [authGuard]
```

#### RoleGuard
Protects routes based on user role (e.g., instructor-only pages).
```typescript
canActivate: [authGuard, roleGuard],
data: { role: UserRole.INSTRUCTOR }
```

### HTTP Interceptors

#### AuthInterceptor
Automatically injects JWT token into all HTTP requests.

#### ErrorInterceptor
Global error handling for HTTP requests.

---

## 🎨 Styling Approach

### Primary Method: TailwindCSS (95%)

**Almost all styling uses Tailwind utility classes directly in templates:**

```html
<div class="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300">
  <h1 class="text-4xl font-bold text-gray-900 mb-4">Title</h1>
  <button class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
    Click me
  </button>
</div>
```

### Supplementary: SCSS (5%)

SCSS is **only** used for:
1. **CSS Custom Properties** - Theme variables that Tailwind references
2. **Global Styles** - CSS reset, base typography
3. **Edge Cases** - Complex animations that Tailwind can't handle

**Component SCSS files are mostly empty or minimal.**

### Theme Configuration

**Tailwind Config** (`tailwind.config.js`):
```javascript
colors: {
  primary: '#6366F1',     // Indigo
  secondary: '#60A5FA',   // Blue
  accent: '#F97316',      // Orange
  // ... full color palette
}
```

**CSS Variables** (`styles/abstracts/_variables.scss`):
```scss
:root {
  --primary: #6366F1;
  --background: #F8F9FD;
  --foreground: #1F2937;
  --radius: 0.75rem;
  // ...
}
```

### Custom Tailwind Classes

Defined in `styles.scss`:
```scss
@layer components {
  .btn-gradient {
    @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white;
  }
  
  .card-hover {
    @apply hover:shadow-card-hover hover:-translate-y-1;
  }
}
```

---

## 🧩 Components

### Shared UI Components

#### Button Component
```html
<app-button
  variant="primary"    <!-- primary | secondary | outline | ghost | destructive -->
  size="md"            <!-- sm | md | lg -->
  [loading]="false"
  [fullWidth]="false"
  (clicked)="handleClick()"
>
  Click me
</app-button>
```

#### Card Component
```html
<app-card [hover]="true" [hasHeader]="true" [hasFooter]="true">
  <div header>Header Content</div>
  Main Content
  <div footer>Footer Content</div>
</app-card>
```

#### Input Component
```html
<app-input
  label="Email"
  type="email"
  formControlName="email"
  [error]="errorMessage"
  [required]="true"
/>
```

### Feature Components

#### CourseCard
Displays course information with image, price, instructor, ratings.

#### BlogCard
Displays blog post with featured image, author, read time.

---

## 🔧 Services

### AuthService
```typescript
// Login
authService.login({ email, password }).subscribe()

// Check authentication
authService.isAuthenticated(): boolean

// Get current user
authService.currentUser$: Observable<User | null>

// Logout
authService.logout()
```

### CourseService
```typescript
// Get courses
courseService.getCourses(filters?).subscribe()

// Get course by ID
courseService.getCourseById(id).subscribe()

// Enroll
courseService.enrollCourse(courseId).subscribe()
```

### BlogService
```typescript
// Get posts
blogService.getPosts(filters?).subscribe()

// Get post by slug
blogService.getPostById(slug).subscribe()
```

---

## 📝 Notes

### Backend Integration
Currently services use mock/stub data. To integrate with a real backend:

1. Update `API_CONFIG.BASE_URL` in `src/app/core/constants/app.constants.ts`
2. Implement actual API calls - services are already set up
3. Add error handling as needed

### Environment Variables
For different environments, use Angular's environment system:
```bash
ng build --configuration production
```

### Next Steps for Full Production
1. Implement remaining page functionality (some are placeholders)
2. Add unit tests
3. Add E2E tests with Playwright
4. Implement internationalization (i18n)
5. Add PWA capabilities
6. Implement actual backend API
7. Add analytics

---

## 🤝 Contributing

This is a learning/portfolio project. Feel free to use as a reference or template for your own Angular projects.

---

## 📄 License

MIT License - feel free to use for learning and projects.

---

## 🎯 Key Highlights

- ✅ **Modern Angular 21** - Latest features and best practices
- ✅ **Standalone Components** - No NgModules
- ✅ **TailwindCSS First** - 95% of styling via utilities
- ✅ **Type-Safe** - Full TypeScript coverage
- ✅ **Production-Ready Structure** - Scalable architecture
- ✅ **Lazy Loading** - Optimized performance
- ✅ **Interceptors & Guards** - Security built-in
- ✅ **Reactive Forms** - Angular Reactive Forms with validation

---

**Built with ❤️ using Angular 21 + TailwindCSS**
