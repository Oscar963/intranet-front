// src/app/services/pagination.service.ts
import { Injectable } from '@angular/core';
import { PaginationMeta, PaginationLink } from '@interfaces/Pagination';

@Injectable({ providedIn: 'root' })
export class PaginationService {
  defaultMeta(): PaginationMeta {
    return {
      current_page: 1,
      last_page: 1,
      from: 0,
      to: 0,
      total: 0,
      links: [],
    };
  }

  parseMeta(meta: any): PaginationMeta {
    return {
      current_page: meta?.current_page ?? 1,
      last_page: meta?.last_page ?? 1,
      from: meta?.from ?? 0,
      to: meta?.to ?? 0,
      total: meta?.total ?? 0,
      links: this.parseLinks(meta?.links),
    };
  }

  parseLinks(links: any[]): PaginationLink[] {
    return (
      links?.map((link, index) => ({
        id: `link-${index}`,
        label: link.label ?? '',
        page: this.extractPageFromUrl(link.url),
        active: link.active ?? false,
      })) ?? []
    );
  }

  extractPageFromUrl(url: string | null): number | null {
    if (!url) return null;
    try {
      const parsedUrl = new URL(url);
      return +(parsedUrl.searchParams.get('page') || 0);
    } catch {
      return null;
    }
  }

  isValidPage(page: number | null, lastPage: number): boolean {
    return !!page && page >= 1 && page <= lastPage;
  }
}
