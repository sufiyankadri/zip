import { Injectable, signal } from '@angular/core';

import { ServiceAction, ServiceMode } from '../models/service.models';

export interface ListingUiState {
  searchQuery: string;
  groupId?: string;
  departmentId?: string;
  mode?: ServiceMode;
  action?: ServiceAction;
  samagraEnabled?: boolean;
  sortBy: 'relevance' | 'name' | 'department';
}

@Injectable({ providedIn: 'root' })
export class DiscoveryStateService {
  readonly homeBrowseTab = signal<'category' | 'department'>('category');
  readonly globalSearchQuery = signal('');
  readonly recentSearches = signal<string[]>(['आय प्रमाणपत्र', 'राशन कार्ड', 'पेंशन']);

  readonly listingUiState = signal<ListingUiState>({
    searchQuery: '',
    sortBy: 'relevance',
  });

  setHomeBrowseTab(tab: 'category' | 'department'): void {
    this.homeBrowseTab.set(tab);
  }

  setGlobalSearchQuery(query: string): void {
    this.globalSearchQuery.set(query);
  }

  addRecentSearch(query: string): void {
    const sanitizedQuery = query.trim();
    if (!sanitizedQuery) {
      return;
    }

    this.recentSearches.update((previous) => {
      const withoutDuplicates = previous.filter((item) => item !== sanitizedQuery);
      return [sanitizedQuery, ...withoutDuplicates].slice(0, 8);
    });
  }

  setListingUiState(nextState: Partial<ListingUiState>): void {
    this.listingUiState.update((state) => ({ ...state, ...nextState }));
  }

  resetListingUiState(): void {
    this.listingUiState.set({
      searchQuery: '',
      sortBy: 'relevance',
    });
  }
}


