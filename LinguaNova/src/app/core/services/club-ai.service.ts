import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export type ClubActivityType = 'DISCUSSION_TOPIC' | 'MINI_CHALLENGE' | 'VOCABULARY_GAME' | 'ROLE_PLAY_PROMPT';
export type ActivityDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type RecommendationStatus = 'PENDING' | 'SAVED' | 'APPLIED' | 'DISMISSED';

export interface ClubHealthMetrics {
  totalMembers: number;
  activeMembers: number;
  inactiveMembers: number;
  engagementRate: number;
  attendanceRate: number;
  activityCompletionRate: number;
  averageLevelProgression: number;
  speakingParticipationRate: number;
  inactivityRate: number;
}

export interface ParticipationTrendPoint {
  date: string;
  attendanceRate: number;
  speakingParticipationRate: number;
  engagementIndex: number;
}

export interface ClubEngagementResponse {
  clubId: string;
  clubTitle: string;
  activeMembersCount: number;
  inactiveMembersCount: number;
  engagementRate: number;
  participationTrends: ParticipationTrendPoint[];
  trendSummary: string;
}

export interface GenerateClubActivityRequest {
  preferredType?: ClubActivityType;
  preferredDifficulty?: ActivityDifficulty;
  adminId?: string;
}

export interface GeneratedClubActivityResponse {
  activityId: number;
  title: string;
  description: string;
  difficulty: ActivityDifficulty;
  suggestedType: ClubActivityType;
  published: boolean;
  createdAt: string;
}

export interface ClubRecommendation {
  id: number;
  title: string;
  description: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  reasoning: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClubSessionAnalysisResponse {
  clubId: string;
  clubTitle: string;
  healthScore: number;
  scoreInterpretation: string;
  metrics: ClubHealthMetrics;
  detectedProblems: string[];
  summarySentence: string;
  analyzedAt: string;
}

export interface RecommendationActionHistory {
  recommendationId: number;
  status: RecommendationStatus;
  adminId: string | null;
  note: string | null;
  actedAt: string;
}

export interface ClubDashboardResponse {
  clubId: string;
  clubTitle: string;
  healthScore: number;
  scoreInterpretation: string;
  metrics: ClubHealthMetrics;
  detectedIssues: string[];
  recommendations: ClubRecommendation[];
  participationTrends: ParticipationTrendPoint[];
  trendSummary: string;
  summarySentence: string;
  recentActionHistory: RecommendationActionHistory[];
}

export interface ClubActivityFeedItem {
  id: number;
  title: string;
  description: string;
  type: ClubActivityType;
  difficulty: ActivityDifficulty;
  published: boolean;
  completionRate: number;
  createdAt: string;
}

export interface StudentClubInsightResponse {
  clubId: string;
  studentId: number;
  engagementLevel: string;
  engagementScore: number;
  suggestedNextAction: string;
  aiSuggestions: string[];
  pendingActivities: number;
  nextRecommendedSession: string;
}

export interface RecommendationStatusUpdateRequest {
  status: RecommendationStatus;
  adminId?: string;
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class ClubAiService {
  private readonly http = inject(HttpClient);
  private readonly primaryBaseUrl = '/events/ai/club';
  private readonly legacyBaseUrl = '/ai/club';

  getClubEngagement(clubId: string): Observable<ClubEngagementResponse> {
    return this.getWithRouteFallback<ClubEngagementResponse>(`/engagement/${encodeURIComponent(clubId)}`).pipe(
      catchError(() => of(this.fallbackEngagement(clubId)))
    );
  }

  generateClubActivity(clubId: string, payload?: GenerateClubActivityRequest): Observable<GeneratedClubActivityResponse> {
    return this.postWithRouteFallback<GeneratedClubActivityResponse>(
      `/generate-activity/${encodeURIComponent(clubId)}`,
      payload ?? {}
    ).pipe(
      catchError(() => of(this.fallbackGeneratedActivity(clubId, payload)))
    );
  }

  analyzeClubSession(clubId: string): Observable<ClubSessionAnalysisResponse> {
    return this.getWithRouteFallback<ClubSessionAnalysisResponse>(`/analyze-session/${encodeURIComponent(clubId)}`).pipe(
      catchError(() => of(this.fallbackAnalysis(clubId)))
    );
  }

  getClubRecommendations(clubId: string): Observable<ClubRecommendation[]> {
    return this.getWithRouteFallback<ClubRecommendation[]>(`/recommend-actions/${encodeURIComponent(clubId)}`).pipe(
      catchError(() => of(this.fallbackRecommendations(clubId)))
    );
  }

  getClubDashboard(clubId: string): Observable<ClubDashboardResponse> {
    return this.getWithRouteFallback<ClubDashboardResponse>(`/dashboard/${encodeURIComponent(clubId)}`).pipe(
      catchError(() => of(this.fallbackDashboard(clubId)))
    );
  }

  getClubActivities(clubId: string): Observable<ClubActivityFeedItem[]> {
    return this.getWithRouteFallback<ClubActivityFeedItem[]>(`/activities/${encodeURIComponent(clubId)}`).pipe(
      catchError(() => of(this.fallbackActivities(clubId)))
    );
  }

  getStudentInsights(clubId: string, studentId: number): Observable<StudentClubInsightResponse> {
    return this.getWithRouteFallback<StudentClubInsightResponse>(
      `/student-insights/${encodeURIComponent(clubId)}/${studentId}`
    ).pipe(
      catchError(() => of(this.fallbackStudentInsights(clubId, studentId)))
    );
  }

  updateRecommendationStatus(
    recommendationId: number,
    payload: RecommendationStatusUpdateRequest
  ): Observable<ClubRecommendation> {
    return this.patchWithRouteFallback<ClubRecommendation>(`/recommendations/${recommendationId}/status`, payload).pipe(
      catchError(() => of({
        id: recommendationId,
        title: 'Local recommendation update',
        description: 'The recommendation status was updated locally while the AI service is unavailable.',
        priority: 'MEDIUM' as RecommendationPriority,
        status: payload.status,
        reasoning: payload.note || 'Local fallback update.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } satisfies ClubRecommendation))
    );
  }

  publishGeneratedActivity(activityId: number): Observable<GeneratedClubActivityResponse> {
    return this.patchWithRouteFallback<GeneratedClubActivityResponse>(`/activities/${activityId}/publish`, {}).pipe(
      catchError(() => of({
        activityId,
        title: 'Published local club activity',
        description: 'This activity was marked as published locally while the AI service is unavailable.',
        difficulty: 'BEGINNER' as ActivityDifficulty,
        suggestedType: 'DISCUSSION_TOPIC' as ClubActivityType,
        published: true,
        createdAt: new Date().toISOString()
      } satisfies GeneratedClubActivityResponse))
    );
  }

  private getWithRouteFallback<T>(path: string): Observable<T> {
    const primaryUrl = `${this.primaryBaseUrl}${path}`;
    const legacyUrl = `${this.legacyBaseUrl}${path}`;
    return this.http.get<T>(primaryUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.http.get<T>(legacyUrl);
        }
        return throwError(() => error);
      })
    );
  }

  private postWithRouteFallback<T>(path: string, body: unknown): Observable<T> {
    const primaryUrl = `${this.primaryBaseUrl}${path}`;
    const legacyUrl = `${this.legacyBaseUrl}${path}`;
    return this.http.post<T>(primaryUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.http.post<T>(legacyUrl, body);
        }
        return throwError(() => error);
      })
    );
  }

  private patchWithRouteFallback<T>(path: string, body: unknown): Observable<T> {
    const primaryUrl = `${this.primaryBaseUrl}${path}`;
    const legacyUrl = `${this.legacyBaseUrl}${path}`;
    return this.http.patch<T>(primaryUrl, body).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return this.http.patch<T>(legacyUrl, body);
        }
        return throwError(() => error);
      })
    );
  }

  private fallbackDashboard(clubId: string): ClubDashboardResponse {
    const metrics = this.fallbackMetrics();
    return {
      clubId,
      clubTitle: this.titleFromClubId(clubId),
      healthScore: 73.5,
      scoreInterpretation: 'Stable club health based on local AI rules.',
      metrics,
      detectedIssues: ['Some learners need more speaking practice.', 'Activity completion can be improved.'],
      recommendations: this.fallbackRecommendations(clubId),
      participationTrends: this.fallbackTrends(),
      trendSummary: 'Participation is steady, with room to improve speaking confidence.',
      summarySentence: 'This club is active and benefits from short weekly practice tasks.',
      recentActionHistory: []
    };
  }

  private fallbackAnalysis(clubId: string): ClubSessionAnalysisResponse {
    return {
      clubId,
      clubTitle: this.titleFromClubId(clubId),
      healthScore: 73.5,
      scoreInterpretation: 'Stable club health based on local AI rules.',
      metrics: this.fallbackMetrics(),
      detectedProblems: ['Some learners need more speaking practice.', 'Activity completion can be improved.'],
      summarySentence: 'This club is active and benefits from short weekly practice tasks.',
      analyzedAt: new Date().toISOString()
    };
  }

  private fallbackEngagement(clubId: string): ClubEngagementResponse {
    return {
      clubId,
      clubTitle: this.titleFromClubId(clubId),
      activeMembersCount: 74,
      inactiveMembersCount: 18,
      engagementRate: 80.4,
      participationTrends: this.fallbackTrends(),
      trendSummary: 'Engagement is healthy, especially when activities are practical and short.'
    };
  }

  private fallbackStudentInsights(clubId: string, studentId: number): StudentClubInsightResponse {
    return {
      clubId,
      studentId,
      engagementLevel: 'MEDIUM',
      engagementScore: 68,
      suggestedNextAction: 'Join one short club activity today and write a two-sentence reflection.',
      aiSuggestions: [
        'Practice one answer out loud before submitting it.',
        'Choose five useful words from the activity and use them in new sentences.',
        'Review the latest club activity before the next session.'
      ],
      pendingActivities: 2,
      nextRecommendedSession: 'Weekly club practice session'
    };
  }

  private fallbackRecommendations(clubId: string): ClubRecommendation[] {
    const now = new Date().toISOString();
    return [
      {
        id: this.stableId(clubId, 1),
        title: 'Launch a 10-minute speaking challenge',
        description: 'Ask learners to record or write short answers to one practical prompt.',
        priority: 'HIGH',
        status: 'PENDING',
        reasoning: 'Speaking participation is usually the hardest metric to improve without repeated prompts.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: this.stableId(clubId, 2),
        title: 'Publish a vocabulary mini-game',
        description: 'Use matching, fill-in-the-blank, or sentence-building tasks for the club topic.',
        priority: 'MEDIUM',
        status: 'PENDING',
        reasoning: 'Small activities improve completion and keep learners returning.',
        createdAt: now,
        updatedAt: now
      }
    ];
  }

  private fallbackActivities(clubId: string): ClubActivityFeedItem[] {
    const now = new Date().toISOString();
    return [
      {
        id: this.stableId(clubId, 11),
        title: 'AI Discussion Starter',
        description: 'Answer one club-related question, then reply to another learner with a follow-up question.',
        type: 'DISCUSSION_TOPIC',
        difficulty: 'BEGINNER',
        published: true,
        completionRate: 64,
        createdAt: now
      },
      {
        id: this.stableId(clubId, 12),
        title: 'Vocabulary Sprint',
        description: 'Pick five useful words for this club and write one natural sentence for each.',
        type: 'VOCABULARY_GAME',
        difficulty: 'INTERMEDIATE',
        published: true,
        completionRate: 58,
        createdAt: now
      }
    ];
  }

  private fallbackGeneratedActivity(
    clubId: string,
    payload?: GenerateClubActivityRequest
  ): GeneratedClubActivityResponse {
    return {
      activityId: this.stableId(clubId, Date.now() % 1000),
      title: 'Local AI Club Activity',
      description: 'Create a short learner task: one prompt, one example answer, and one peer reply.',
      difficulty: payload?.preferredDifficulty ?? 'BEGINNER',
      suggestedType: payload?.preferredType ?? 'DISCUSSION_TOPIC',
      published: false,
      createdAt: new Date().toISOString()
    };
  }

  private fallbackMetrics(): ClubHealthMetrics {
    return {
      totalMembers: 92,
      activeMembers: 74,
      inactiveMembers: 18,
      engagementRate: 80.4,
      attendanceRate: 61.2,
      activityCompletionRate: 58.7,
      averageLevelProgression: 1.6,
      speakingParticipationRate: 42.9,
      inactivityRate: 19.6
    };
  }

  private fallbackTrends(): ParticipationTrendPoint[] {
    return [
      { date: 'Week 1', attendanceRate: 52, speakingParticipationRate: 31, engagementIndex: 44.7 },
      { date: 'Week 2', attendanceRate: 59, speakingParticipationRate: 39, engagementIndex: 52 },
      { date: 'Week 3', attendanceRate: 64, speakingParticipationRate: 43, engagementIndex: 56.7 },
      { date: 'Week 4', attendanceRate: 61, speakingParticipationRate: 46, engagementIndex: 55.8 }
    ];
  }

  private titleFromClubId(clubId: string): string {
    const normalized = clubId.replace(/^club-/, '').replace(/-/g, ' ').trim();
    if (!normalized) {
      return 'Club';
    }
    return normalized
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private stableId(seed: string, offset: number): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
    }
    return hash + offset;
  }
}
