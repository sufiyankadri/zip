import { Component, computed, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { DiscoveryStateService } from '../../core/services/discovery-state.service';
import { ApplicationSummaryCardsComponent } from '../../shared/components/application-summary-cards/application-summary-cards.component';
import { BrowseToggleComponent } from '../../shared/components/browse-toggle/browse-toggle.component';
import { CategoryCardGridComponent } from '../../shared/components/category-card-grid/category-card-grid.component';
import { DepartmentListComponent } from '../../shared/components/department-list/department-list.component';
import { EligibilityWidgetComponent } from '../../shared/components/eligibility-widget/eligibility-widget.component';
import { MovingBannerComponent } from '../../shared/components/moving-banner/moving-banner.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ApplicationSummaryCardsComponent,
    BrowseToggleComponent,
    CategoryCardGridComponent,
    DepartmentListComponent,
    EligibilityWidgetComponent,
    MovingBannerComponent,
    SearchBarComponent,
    TopHeaderComponent,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit, OnDestroy {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly discoveryState = inject(DiscoveryStateService);
  private readonly router = inject(Router);
  private slideInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly categories = this.repository.getCategories();
  protected readonly departments = this.repository.getDepartments();
  protected readonly banners = this.repository.getHomeBanners();
  protected readonly applicationSummary = this.repository.getDefaultApplicationSummary();
  protected readonly eligibility = this.repository.getDefaultEligibilityState();
  protected readonly samagraId = signal('');

  protected readonly browseTab = this.discoveryState.homeBrowseTab;
  protected readonly searchQuery = signal(this.discoveryState.globalSearchQuery());
  protected readonly currentSlide = signal(0);
  protected readonly filteredCategories = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.categories;
    }

    return this.categories.filter((category) =>
      `${category.nameHindi} ${category.nameEnglish} ${category.description}`.toLowerCase().includes(query),
    );
  });

  protected readonly filteredDepartments = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) {
      return this.departments;
    }

    return this.departments.filter((department) =>
      `${department.name} ${department.description}`.toLowerCase().includes(query),
    );
  });

  ngOnInit(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide.set((this.currentSlide() + 1) % this.banners.length);
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  goToSlide(index: number): void {
    this.currentSlide.set(index);
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    this.slideInterval = setInterval(() => {
      this.currentSlide.set((this.currentSlide() + 1) % this.banners.length);
    }, 4000);
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
    this.discoveryState.setGlobalSearchQuery(query.trim());
  }

  onSearchSubmit(query: string): void {
    const sanitizedQuery = query.trim();
    this.searchQuery.set(sanitizedQuery);
    this.discoveryState.setGlobalSearchQuery(sanitizedQuery);
    if (sanitizedQuery) {
      this.discoveryState.addRecentSearch(sanitizedQuery);
    }
  }

  onBrowseTabChange(tab: 'category' | 'department'): void {
    this.discoveryState.setHomeBrowseTab(tab);
  }

  openCategory(categoryId: string): void {
    this.router.navigate(['/group', 'category', categoryId]);
  }

  openDepartment(departmentId: string): void {
    this.router.navigate(['/group', 'department', departmentId]);
  }

  openEligibleSchemes(): void {
    this.router.navigate(['/services'], {
      queryParams: {
        samagraEnabled: true,
      },
    });
  }

  onSamagraIdChange(value: string): void {
    this.samagraId.set(value);
  }

  onSamagraSearch(query: string): void {
    const sanitizedQuery = query.trim();
    if (!sanitizedQuery) {
      this.openEligibleSchemes();
      return;
    }

    this.discoveryState.setGlobalSearchQuery(sanitizedQuery);
    this.discoveryState.addRecentSearch(sanitizedQuery);
    this.router.navigate(['/services'], {
      queryParams: {
        samagraEnabled: true,
        q: sanitizedQuery,
      },
    });
  }

  checkWithoutSamagra(): void {
    this.router.navigate(['/services'], {
      queryParams: {
        categoryId: 'social-security',
      },
    });
  }
}

