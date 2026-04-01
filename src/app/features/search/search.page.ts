import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DiscoveryStateService } from '../../core/services/discovery-state.service';
import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [SearchBarComponent, TopHeaderComponent],
  templateUrl: './search.page.html',
  styleUrl: './search.page.scss',
})
export class SearchPage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly discoveryState = inject(DiscoveryStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly searchQuery = signal('');
  protected readonly recentSearches = this.discoveryState.recentSearches;

  protected readonly searchResults = computed(() => {
    return this.repository.searchAll(this.searchQuery());
  });

  protected readonly hasResults = computed(() => {
    const results = this.searchResults();
    return results.services.length + results.categories.length + results.departments.length > 0;
  });

  constructor() {
    this.route.queryParamMap.subscribe((params) => {
      const q = params.get('q') ?? this.discoveryState.globalSearchQuery();
      this.searchQuery.set(q);
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSearchSubmit(value: string): void {
    this.searchQuery.set(value);
    this.discoveryState.setGlobalSearchQuery(value);
    this.discoveryState.addRecentSearch(value);
  }

  useRecentSearch(value: string): void {
    this.onSearchSubmit(value);
  }

  openService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  openCategory(categoryId: string): void {
    this.router.navigate(['/group', 'category', categoryId]);
  }

  openDepartment(departmentId: string): void {
    this.router.navigate(['/group', 'department', departmentId]);
  }

  openAllServices(): void {
    this.router.navigate(['/services'], {
      queryParams: {
        q: this.searchQuery(),
      },
    });
  }
}
