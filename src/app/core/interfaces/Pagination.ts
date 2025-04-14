// src/app/interfaces/Pagination.ts
export interface PaginationMeta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
  links: PaginationLink[];
}

export interface PaginationLink {
  id: string;
  label: string;
  page: number | null;
  active: boolean;
}
