# LinguaNova – Language Learning Platform

## Overview

This project was developed as part of the **PIDEV – 4th Year Software Engineering Program** at **Esprit School of Engineering** (Academic Year 2025–2026).

**LinguaNova** is a full-stack web platform designed to facilitate language learning online. It provides students with access to courses, live classes, exams, clubs, and events, while giving instructors the tools to create and manage their content. The platform is built on a modern microservices architecture paired with a reactive Angular frontend.

---

## Features

### Student Features
- **Course Browsing & Enrollment** – Browse the catalog, view detailed course pages, and enroll in courses
- **My Courses** – Track enrolled courses and continue learning at any pace
- **Course Flow** – Step-by-step lesson navigation within a course
- **Exams** – Take exams, view submitted copies, and track results
- **Live Classes** – Attend real-time virtual language sessions
- **Events & Calendar** – Browse upcoming events and manage personal schedule
- **Clubs** – Join language learning communities
- **Checkout** – Secure course purchase flow
- **Student Dashboard** – Personalized overview of progress and activity
- **Student Profile** – Manage personal information

### Instructor Features
- **Course Creation** – Multi-step wizard: title, description, structure (modules & lessons), quizzes, pricing, and deployment
- **Course Editing** – Update existing courses
- **Instructor Courses** – Manage all published courses
- **Exam Management** – Create, edit, and review exam submissions
- **Instructor Dashboard** – Overview of courses, enrollments, and revenue
- **Instructor Profile** – Manage professional information

### Platform Features
- **Authentication** – Login, registration, JWT-based session management
- **Role-Based Access Control** – Route guards enforcing Student / Instructor roles
- **HTTP Interceptors** – Automatic JWT injection and global error handling
- **Responsive Design** – Mobile-first UI using TailwindCSS
- **Lazy Loading** – All routes lazy-loaded for optimal performance
- **Pricing Plans** – Subscription and one-time payment options

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Angular | 21.1.0 | SPA framework (standalone components) |
| TypeScript | 5.9.2 | Type-safe language |
| RxJS | 7.8.0 | Reactive state management |
| TailwindCSS | 3.4.19 | Utility-first styling |
| SCSS | – | Supplementary modular styles |
| Angular SSR | 21.1.3 | Server-Side Rendering |
| Lucide Angular | 0.563.0 | Icon library |
| Express | 5.1.0 | SSR server |

### Backend

| Microservice | Framework | Port | Database | Purpose |
|---|---|---|---|---|
| **course-service** | Spring Boot 3.2.5 | 8081 | MySQL | Course, module, lesson & quiz management |
| **user-service** | Spring Boot 4.0.3 | 8082 | MySQL | User accounts & authentication |
| **examen-service** | Spring Boot 4.0.3 | 8093 | MySQL | Exams, questions, answers & submissions |
| **quiz-service** | Spring Boot | 8086 | MySQL | Quiz management |
| **Eureka-Server** | Spring Boot 4.0.3 | 8761 | – | Service discovery (Netflix Eureka) |
| **API_Gateway** | Spring Boot 3.4.2 | – | – | Reactive gateway (Spring Cloud Gateway + WebFlux) |
| **gateway** | Spring Boot 4.0.3 | – | – | MVC gateway (Spring Cloud Gateway MVC) |

**Common backend dependencies:** Spring Data JPA · Spring Security · JJWT · Lombok · Spring Cloud Netflix Eureka Client · Spring Boot Actuator · MySQL Connector

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Angular Frontend                           │
│                   (port 4200 – ng serve)                        │
│                                                                 │
│  Auth Guard · Role Guard · JWT Interceptor · Error Interceptor  │
└───────────────────────────┬─────────────────────────────────────┘
                            │  HTTP / Proxy (dev)
                            │
            ┌───────────────▼───────────────┐
            │         API Gateway           │
            │  Spring Cloud Gateway         │
            │  (routes requests to services)│
            └──┬──────────┬────────┬────────┘
               │          │        │
    ┌──────────▼──┐  ┌────▼────┐  ┌▼────────────┐  ┌────────────┐
    │course-service│  │  user-  │  │examen-service│  │quiz-service│
    │  port 8081  │  │ service │  │  port 8093  │  │ port 8086  │
    │  (MySQL PI) │  │port 8082│  │  (MySQL)    │  │  (MySQL)   │
    └─────────────┘  └─────────┘  └─────────────┘  └────────────┘
               │          │              │                │
    ┌──────────▼──────────▼──────────────▼────────────────▼──────┐
    │              Eureka Server – Service Discovery              │
    │                       port 8761                             │
    └─────────────────────────────────────────────────────────────┘
```

### Development Proxy Configuration

In development, the Angular dev server uses a proxy to avoid CORS issues:

| Proxy Path | Target Service | Port |
|---|---|---|
| `/PIproject/api/courses` | course-service | 8081 |
| `/PIproject` | user-service | 8082 |
| `/api/exams`, `/api/questions`, `/api/reponses`, `/api/student-*` | examen-service | 8093 |
| `/api/quiz` | quiz-service | 8086 |
| `/api` | generic backend | 3000 |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm** ≥ 10
- **Java 17+** (JDK – e.g. Eclipse Temurin)
- **Maven** (or use the included `mvnw` wrapper)
- **MySQL** running on port 3306

### 1. Start the Eureka Server

```bash
cd backend/microservices/Eureka-Server
./mvnw spring-boot:run
```

The Eureka dashboard will be available at `http://localhost:8761`.

### 2. Start the Backend Microservices

Start each service in a separate terminal. Ensure MySQL is running and the `PI` database exists (or is created automatically).

```bash
# course-service
cd backend/microservices/courss-service
./mvnw spring-boot:run
# → http://localhost:8081

# user-service
cd backend/microservices/user-service
./mvnw spring-boot:run
# → http://localhost:8082

# examen-service
cd backend/microservices/examen-service
./mvnw spring-boot:run
# → http://localhost:8093

# API Gateway
cd backend/microservices/API_Gateway
./mvnw spring-boot:run
```

> **Windows users:** use `mvnw.cmd` instead of `./mvnw`, or run the included `run-backend.ps1` PowerShell script in the `courss-service` folder.

### 3. Start the Angular Frontend

```bash
cd LinguaNova
npm install
npm start
```

The application will be available at `http://localhost:4200`.

### 4. Database Configuration

Each microservice connects to MySQL with the following defaults (editable in `src/main/resources/application.properties`):

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/PI?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

---

## Project Structure

```
integration/
├── LinguaNova/                    # Angular 21 frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── constants/     # API endpoints, storage keys
│   │   │   │   ├── guards/        # Auth & role guards
│   │   │   │   ├── interceptors/  # JWT & error interceptors
│   │   │   │   ├── models/        # TypeScript interfaces
│   │   │   │   └── services/      # Shared services
│   │   │   ├── features/
│   │   │   │   ├── about/
│   │   │   │   ├── admin/
│   │   │   │   ├── auth/          # Login, Register
│   │   │   │   ├── calendar/
│   │   │   │   ├── checkout/
│   │   │   │   ├── clubs/
│   │   │   │   ├── courses/       # Course list, detail, creation, flow
│   │   │   │   ├── dashboard/     # Student & Instructor dashboards
│   │   │   │   ├── events/        # Event list & creation
│   │   │   │   ├── exams/         # Exam list, form, take, copies
│   │   │   │   ├── live-class/
│   │   │   │   ├── pricing/
│   │   │   │   └── profile/       # Student & Instructor profiles
│   │   │   ├── layout/
│   │   │   │   ├── footer/
│   │   │   │   ├── main-layout/
│   │   │   │   └── navbar/
│   │   │   └── shared/
│   │   ├── styles/                # SCSS architecture (abstracts, base, themes)
│   │   └── proxy.conf.js          # Dev proxy configuration
│   ├── angular.json
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/
    └── microservices/
        ├── Eureka-Server/         # Service discovery
        ├── API_Gateway/           # Spring Cloud Gateway (reactive)
        ├── gateway/               # Spring Cloud Gateway (MVC)
        ├── courss-service/        # Course management (port 8081)
        ├── user-service/          # User & auth (port 8082)
        └── examen-service/        # Exam management (port 8093)
```

---

## Academic Context

Developed at **Esprit School of Engineering – Tunisia**

**PIDEV – 4SAE | 2025–2026**

This project is part of the end-of-year integration project (Projet Intégré) for the 4th year Software Engineering curriculum at **Esprit School of Engineering**.

---

## Contributors

> *Team members contributing to this project (update with full names and roles)*

| Name | Role |
|---|---|
| *(Member 1)* | Frontend Developer |
| *(Member 2)* | Backend Developer |
| *(Member 3)* | Full-Stack / DevOps |
| *(Member 4)* | Full-Stack Developer |

---

## Acknowledgments

- **Esprit School of Engineering** for providing the academic framework and guidance
- The open-source communities behind Angular, Spring Boot, Spring Cloud, TailwindCSS, and Netflix Eureka
- All supervisors and teaching staff who supported the project
