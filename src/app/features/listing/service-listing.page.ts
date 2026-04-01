import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceAction, ServiceFilters } from '../../core/models/service.models';
import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import {
  AdvancedFilterSelection,
  FilterBottomSheetComponent,
} from '../../shared/components/filter-bottom-sheet/filter-bottom-sheet.component';
import { FilterChip, FilterChipsComponent } from '../../shared/components/filter-chips/filter-chips.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ServiceListComponent } from '../../shared/components/service-list/service-list.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-service-listing-page',
  standalone: true,
  imports: [
    FilterBottomSheetComponent,
    FilterChipsComponent,
    FormsModule,
    SearchBarComponent,
    ServiceListComponent,
    TopHeaderComponent,
  ],
  templateUrl: './service-listing.page.html',
  styleUrl: './service-listing.page.scss',
})
export class ServiceListingPage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly contextCategoryId = signal<string | undefined>(undefined);
  protected readonly contextDepartmentId = signal<string | undefined>(undefined);
  protected readonly searchQuery = signal('');

  protected readonly quickMode = signal<'Online' | 'Portal' | 'Assisted' | null>(null);
  protected readonly quickAction = signal<ServiceAction | null>(null);
  protected readonly quickSamagra = signal(false);

  protected readonly advancedFilters = signal<AdvancedFilterSelection>({});
  protected readonly sortBy = signal<'relevance' | 'name' | 'department'>('relevance');
  protected readonly isAdvancedSheetOpen = signal(false);

  protected readonly departmentNameMap = computed(() => {
    return Object.fromEntries(this.repository.getDepartments().map((department) => [department.id, department.name]));
  });

  protected readonly availableGroups = computed(() => {
    if (this.contextCategoryId()) {
      return this.repository.getGroupsByCategory(this.contextCategoryId()!);
    }

    if (this.contextDepartmentId()) {
      return this.repository.getGroupsByDepartment(this.contextDepartmentId()!);
    }

    return this.repository.getGroups();
  });

  protected readonly availableDepartments = computed(() => {
    if (this.contextCategoryId()) {
      return this.repository.getDepartmentsForCategory(this.contextCategoryId()!);
    }

    return this.repository.getDepartments();
  });

  protected readonly quickChips = computed<FilterChip[]>(() => {
    return [
      { id: 'mode-online', label: 'Online', active: this.quickMode() === 'Online' },
      { id: 'mode-portal', label: 'Portal', active: this.quickMode() === 'Portal' },
      { id: 'mode-assisted', label: 'Assisted', active: this.quickMode() === 'Assisted' },
      { id: 'samagra', label: 'Samagra Enabled', active: this.quickSamagra() },
      { id: 'action-apply', label: 'Apply', active: this.quickAction() === 'Apply' },
      { id: 'action-track', label: 'Track', active: this.quickAction() === 'Track' },
      { id: 'action-download', label: 'Download', active: this.quickAction() === 'Download' },
      { id: 'action-receipt', label: 'Receipt', active: this.quickAction() === 'Receipt' },
    ];
  });

  protected readonly activeFilterSummary = computed(() => {
    const summary: string[] = [];

    if (this.contextCategoryId()) {
      const category = this.repository.getCategoryById(this.contextCategoryId());
      if (category) {
        summary.push(category.nameHindi);
      }
    }

    if (this.contextDepartmentId()) {
      const department = this.repository.getDepartmentById(this.contextDepartmentId());
      if (department) {
        summary.push(department.name);
      }
    }

    if (this.quickMode()) {
      summary.push(this.quickMode()!);
    }

    if (this.quickAction()) {
      summary.push(this.quickAction()!);
    }

    if (this.quickSamagra()) {
      summary.push('Samagra Enabled');
    }

    if (this.advancedFilters().groupId) {
      const group = this.repository.getGroupById(this.advancedFilters().groupId);
      if (group) {
        summary.push(group.name);
      }
    }

    if (this.advancedFilters().departmentId) {
      const department = this.repository.getDepartmentById(this.advancedFilters().departmentId);
      if (department) {
        summary.push(department.name);
      }
    }

    return summary;
  });

  protected readonly filteredServices = computed(() => {
    const filters: ServiceFilters = {
      categoryId: this.contextCategoryId(),
      departmentId: this.advancedFilters().departmentId ?? this.contextDepartmentId(),
      groupId: this.advancedFilters().groupId,
      searchQuery: this.searchQuery() || undefined,
      mode: this.quickMode() ?? this.advancedFilters().mode,
      action: this.quickAction() ?? this.advancedFilters().action,
      samagraEnabled:
        this.quickSamagra() || this.advancedFilters().samagraEnabled
          ? true
          : this.advancedFilters().samagraEnabled,
    };

    const services = this.repository.getServices(filters);
    return this.sortServices(services);
  });

  constructor() {
    this.route.queryParamMap.subscribe((queryParams) => {
      this.contextCategoryId.set(queryParams.get('categoryId') ?? undefined);
      this.contextDepartmentId.set(queryParams.get('departmentId') ?? undefined);
      this.searchQuery.set(queryParams.get('q') ?? '');

      const action = queryParams.get('action') as ServiceAction | null;
      this.quickAction.set(action ?? null);

      const samagraEnabled = queryParams.get('samagraEnabled');
      this.quickSamagra.set(samagraEnabled === 'true');
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSearchSubmit(value: string): void {
    this.searchQuery.set(value);
  }

  onSortChange(value: string): void {
    if (value === 'relevance' || value === 'name' || value === 'department') {
      this.sortBy.set(value);
    }
  }

  onQuickChipToggle(chipId: string): void {
    if (chipId.startsWith('mode-')) {
      const modeValue = chipId.replace('mode-', '') as 'online' | 'portal' | 'assisted';
      const nextMode =
        modeValue === 'online' ? 'Online' : modeValue === 'portal' ? 'Portal' : 'Assisted';
      this.quickMode.set(this.quickMode() === nextMode ? null : nextMode);
      return;
    }

    if (chipId === 'samagra') {
      this.quickSamagra.set(!this.quickSamagra());
      return;
    }

    if (chipId.startsWith('action-')) {
      const action = chipId.replace('action-', '') as 'apply' | 'track' | 'download' | 'receipt';
      const nextAction: ServiceAction =
        action === 'apply'
          ? 'Apply'
          : action === 'track'
            ? 'Track'
            : action === 'download'
              ? 'Download'
              : 'Receipt';

      this.quickAction.set(this.quickAction() === nextAction ? null : nextAction);
    }
  }

  clearFilters(): void {
    this.quickMode.set(null);
    this.quickAction.set(null);
    this.quickSamagra.set(false);
    this.advancedFilters.set({});
  }

  openAdvancedFilters(): void {
    this.isAdvancedSheetOpen.set(true);
  }

  closeAdvancedFilters(): void {
    this.isAdvancedSheetOpen.set(false);
  }

  applyAdvancedFilters(selection: AdvancedFilterSelection): void {
    this.advancedFilters.set(selection);
  }

  openService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  private sortServices(services: ReturnType<ServiceRepositoryService['getServices']>) {
    if (this.sortBy() === 'name') {
      return [...services].sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    }

    if (this.sortBy() === 'department') {
      return [...services].sort((a, b) => {
        const departmentA = this.departmentNameMap()[a.departmentId] ?? '';
        const departmentB = this.departmentNameMap()[b.departmentId] ?? '';
        return departmentA.localeCompare(departmentB);
      });
    }

    return services;
  }
}
