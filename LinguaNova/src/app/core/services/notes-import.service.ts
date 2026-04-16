import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import type {
  NoteImportArticlePayload,
  NoteImportBatchRequest,
  NoteImportCandidate,
} from '../models/note.model';

type RssItem = {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
  source?: string;
};

@Injectable({ providedIn: 'root' })
export class NotesImportService {
  private readonly stopwords = new Set<string>([
    'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'for', 'in', 'on', 'at', 'by', 'with',
    'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'that', 'this', 'these', 'those',
    'it', 'its', 'as', 'about', 'into', 'over', 'after', 'before', 'between', 'than', 'then',
    'le', 'la', 'les', 'de', 'du', 'des', 'et', 'ou', 'est', 'sont', 'dans', 'sur', 'avec',
    'pour', 'par', 'au', 'aux', 'en', 'un', 'une', 'ce', 'cet', 'cette', 'ces', 'que', 'qui',
    'quoi', 'dont', 'ne', 'pas', 'plus', 'moins', 'se', 'sa', 'son', 'ses', 'their', 'they',
    'you', 'your', 'we', 'our', 'i', 'me', 'my', 'he', 'she', 'his', 'her', 'them', 'their',
  ]);

  constructor(private http: HttpClient) { }

  extractKeywords(prompt: string, maxTerms = 8): string[] {
    const tokens = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\u00C0-\u017F\s]/gi, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 2 && !this.stopwords.has(t));

    const freq = new Map<string, number>();
    for (const token of tokens) {
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }

    return [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxTerms)
      .map(([term]) => term);
  }

  buildGoogleNewsRssUrl(keywords: string[], language = 'en', region = 'US'): string {
    const query = encodeURIComponent(keywords.join(' '));
    return `https://news.google.com/rss/search?q=${query}&hl=${language}-${region}&gl=${region}&ceid=${region}:${language}`;
  }

  discoverFromPrompt(prompt: string, maxArticles = 12): Observable<NoteImportCandidate[]> {
    const query = prompt.trim();
    if (!query) {
      return new Observable((s) => { s.next([]); s.complete(); });
    }

    // Use backend DuckDuckGo search — returns real article URLs (no Google News redirects)
    return this.http.get<Array<{title: string; url: string; snippet: string; sourceDomain: string}>>(
      `/notes/web-search?q=${encodeURIComponent(query)}`
    ).pipe(
      map((items) => {
        const keywords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        return items
          .map((item) => {
            const relevanceScore = this.computeScore(item.title, item.snippet, query.toLowerCase(), keywords);
            return {
              title: item.title,
              content: `${item.title}\n\n${item.snippet}\n\nSource: ${item.sourceDomain}\nURL: ${item.url}`,
              sourceUrl: item.url,
              sourceDomain: item.sourceDomain,
              sourceTitle: item.title,
              publishedAt: null,
              fetchedAt: new Date().toISOString(),
              relevanceScore,
              selected: true,
            } as NoteImportCandidate;
          })
          .sort((a, b) => b.relevanceScore - a.relevanceScore)
          .slice(0, maxArticles);
      })
    );
  }

  buildImportBatchRequest(
    userId: number,
    cahierId: number,
    importQuery: string,
    selectedCandidates: NoteImportCandidate[]
  ): NoteImportBatchRequest {
    return {
      userId,
      cahierId,
      importQuery,
      articles: selectedCandidates.map((c) => this.toArticlePayload(c)),
    };
  }

  private parseRss(xml: string): RssItem[] {
    if (typeof window === 'undefined' || typeof DOMParser === 'undefined') return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const items = Array.from(doc.querySelectorAll('item'));

    return items.map((item) => {
      const title = this.readNodeText(item, 'title');
      const googleRedirectLink = this.readNodeText(item, 'link');
      // Google News RSS <link> is a redirect URL (news.google.com/rss/articles/...).
      // The *real* article URL lives inside <description> as an <a href>.
      const descriptionRaw = item.querySelector('description')?.textContent ?? '';
      const realUrl = this.extractRealUrlFromDescription(descriptionRaw) ?? googleRedirectLink;
      const description = this.cleanText(descriptionRaw);
      const pubDate = this.readNodeText(item, 'pubDate');
      const source = this.readNodeText(item, 'source');
      return { title, link: realUrl, description, pubDate, source };
    }).filter((item) => !!item.link && !!item.title);
  }

  private rankAndMapCandidates(
    items: RssItem[],
    prompt: string,
    keywords: string[],
    maxArticles: number
  ): NoteImportCandidate[] {
    const promptText = prompt.toLowerCase();

    return items
      .map((item) => {
        const title = this.cleanText(item.title);
        const sourceUrl = item.link.trim();
        const rawSnippet = this.cleanText(item.description);
        const snippet = rawSnippet.length > 650 ? `${rawSnippet.slice(0, 650)}...` : rawSnippet;
        const sourceDomain = this.extractDomain(sourceUrl);
        const publishedAt = this.normalizeDate(item.pubDate);
        const fetchedAt = new Date().toISOString();
        const relevanceScore = this.computeScore(title, rawSnippet, promptText, keywords);

        return {
          title,
          content: this.toNoteContent(title, snippet, sourceUrl, item.source ?? sourceDomain ?? 'Unknown source'),
          sourceUrl,
          sourceDomain,
          sourceTitle: title,
          publishedAt,
          fetchedAt,
          relevanceScore,
          selected: true,
        } as NoteImportCandidate;
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxArticles);
  }

  private toArticlePayload(candidate: NoteImportCandidate): NoteImportArticlePayload {
    return {
      title: candidate.title,
      content: candidate.content,
      sourceUrl: candidate.sourceUrl,
      sourceDomain: candidate.sourceDomain ?? null,
      sourceTitle: candidate.sourceTitle ?? candidate.title,
      publishedAt: candidate.publishedAt ?? null,
      fetchedAt: candidate.fetchedAt,
    };
  }

  private toNoteContent(title: string, snippet: string, url: string, source: string): string {
    return [
      `Imported article: ${title}`,
      '',
      snippet || '(No snippet available)',
      '',
      `Source: ${source}`,
      `URL: ${url}`,
    ].join('\n');
  }

  private computeScore(title: string, snippet: string, prompt: string, keywords: string[]): number {
    const corpus = `${title} ${snippet}`.toLowerCase();
    let score = 0;
    for (const keyword of keywords) {
      if (corpus.includes(keyword)) score += 2;
      if (title.toLowerCase().includes(keyword)) score += 3;
    }
    if (prompt.length > 0 && corpus.includes(prompt.slice(0, Math.min(prompt.length, 30)))) {
      score += 2;
    }
    return score;
  }

  private extractDomain(url: string): string | null {
    try {
      const host = new URL(url).hostname;
      return host.startsWith('www.') ? host.slice(4) : host;
    } catch {
      return null;
    }
  }

  private normalizeDate(value?: string): string | null {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  private readNodeText(parent: Element, tagName: string): string {
    return parent.querySelector(tagName)?.textContent?.trim() ?? '';
  }

  /**
   * Google News RSS description contains HTML like:
   * <a href="https://real-article.com/..." target="_blank">Title</a>
   * We parse that href to get the actual article URL.
   */
  private extractRealUrlFromDescription(descriptionHtml: string): string | null {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(descriptionHtml, 'text/html');
      const anchor = doc.querySelector('a[href]');
      if (!anchor) return null;
      const href = anchor.getAttribute('href') ?? '';
      // Make sure it's not another news.google.com link
      if (href && !href.includes('news.google.com')) {
        return href;
      }
      return null;
    } catch {
      return null;
    }
  }

  private cleanText(value: string): string {
    return value
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
