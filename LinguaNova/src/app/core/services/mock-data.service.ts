import { Injectable } from '@angular/core';
import { Course, CourseCategory, CourseLevel } from '../models/course.model';
import { Event, EventType } from '../models/event.model';

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    readonly courses: Course[] = [
        {
            id: '1',
            title: 'Complete Web Design: From Figma to Webflow',
            description: 'Master the entire process from design to development. This course covers Figma basics, UI/UX principles, and building production-ready sites in Webflow.',
            shortDescription: 'From design to development masterclass.',
            image: 'https://images.unsplash.com/photo-1541462608141-ad6019795808?auto=format&fit=crop&q=80&w=800',
            price: 120,
            discountedPrice: 85,
            category: CourseCategory.ENGLISH_LANGUAGE,
            level: CourseLevel.BEGINNER,
            duration: 45,
            lessonsCount: 32,
            studentsCount: 1250,
            rating: 4.8,
            reviewsCount: 156,
            instructor: {
                id: 'ins-1',
                name: 'Sarah Drasner',
                title: 'Senior Design Lead',
                avatar: 'https://i.pravatar.cc/150?u=sarah',
                bio: 'Sarah is an award-winning designer with over 15 years of experience.',
                coursesCount: 12,
                studentsCount: 45000,
                rating: 4.9
            },
            language: 'English',
            subtitles: ['English', 'Spanish'],
            syllabus: [],
            requirements: ['Basic understanding of computers', 'No design experience needed'],
            learningOutcomes: ['Create UI in Figma', 'Build responsive sites in Webflow', 'Understand color theory'],
            tags: ['Design', 'UX', 'Figma'],
            isFeatured: true,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '2',
            title: 'Advanced React & Next.js Patterns',
            description: 'Take your React skills to the next level. Learn about Server Components, Hydration, and full-stack development with App Router.',
            shortDescription: 'Master modern React and Next.js.',
            image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
            price: 150,
            discountedPrice: 120,
            category: CourseCategory.ACADEMIC_ENGLISH,
            level: CourseLevel.ADVANCED,
            duration: 60,
            lessonsCount: 48,
            studentsCount: 5400,
            rating: 4.9,
            reviewsCount: 890,
            instructor: {
                id: 'ins-2',
                name: 'Dan Abramov',
                title: 'Core React Developer',
                avatar: 'https://i.pravatar.cc/150?u=dan',
                bio: 'Expert in React development and state management.',
                coursesCount: 5,
                studentsCount: 120000,
                rating: 5.0
            },
            language: 'English',
            subtitles: ['English', 'French', 'German'],
            syllabus: [],
            requirements: ['Proficient in JavaScript', 'Basic React knowledge'],
            learningOutcomes: ['Use Server Components', 'Optimize performance', 'Advanced state management'],
            tags: ['React', 'Next.js', 'Web Development'],
            isFeatured: true,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            id: '3',
            title: 'Python for Data Science Masterclass',
            description: 'Learn Python, Pandas, Matplotlib, and Scikit-Learn for data analysis and machine learning.',
            shortDescription: 'The complete data science roadmap.',
            image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
            price: 99,
            category: CourseCategory.GENERAL_ENGLISH,
            level: CourseLevel.INTERMEDIATE,
            duration: 55,
            lessonsCount: 40,
            studentsCount: 8200,
            rating: 4.7,
            reviewsCount: 430,
            instructor: {
                id: 'ins-3',
                name: 'Jose Portilla',
                title: 'Data Scientist',
                avatar: 'https://i.pravatar.cc/150?u=jose',
                bio: 'Passionate about teaching data science and machine learning.',
                coursesCount: 20,
                studentsCount: 1000000,
                rating: 4.8
            },
            language: 'English',
            subtitles: ['English'],
            syllabus: [],
            requirements: ['No programming experience needed'],
            learningOutcomes: ['Clean data with Pandas', 'Visualize data', 'Build ML models'],
            tags: ['Python', 'Data Science', 'ML'],
            isFeatured: false,
            isPublished: true,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    readonly events: Event[] = [
        {
            id: 'e1',
            title: 'Web Design Trends 2024 Webinar',
            description: 'Join us for a deep dive into the latest UI/UX trends.',
            type: EventType.WEBINAR,
            startDate: new Date(Date.now() + 86400000 * 7),
            endDate: new Date(Date.now() + 86400000 * 7 + 3600000),
            location: 'Online',
            meetingUrl: 'https://zoom.us/j/demo',
            organizer: {
                id: 'o1',
                name: 'Design Masters',
                title: 'Design Community',
                avatar: 'https://i.pravatar.cc/150?u=dm'
            },
            maxAttendees: 500,
            currentAttendees: 450,
            image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
            tags: ['Design', 'Web', 'Trends'],
            isPublic: true,
            requiresApproval: false,
            price: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];
}
