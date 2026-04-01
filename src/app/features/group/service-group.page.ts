import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
  ServiceAction,
  ServiceFilters,
  ServiceItem,
} from '../../core/models/service.models';
import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { DepartmentFilterListComponent } from '../../shared/components/department-filter-list/department-filter-list.component';
import { QuickActionGridComponent } from '../../shared/components/quick-action-grid/quick-action-grid.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ServiceListComponent } from '../../shared/components/service-list/service-list.component';
import { SubcategoryGridComponent } from '../../shared/components/subcategory-grid/subcategory-grid.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-service-group-page',
  standalone: true,
  imports: [
    DepartmentFilterListComponent,
    QuickActionGridComponent,
    SearchBarComponent,
    ServiceListComponent,
    SubcategoryGridComponent,
    TopHeaderComponent,
  ],
  templateUrl: './service-group.page.html',
  styleUrl: './service-group.page.scss',
})
export class ServiceGroupPage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly contextType = signal<'category' | 'department'>('category');
  protected readonly contextId = signal('');

  protected readonly searchQuery = signal('');
  protected readonly selectedAction = signal<ServiceAction | null>(null);
  protected readonly selectedGroupId = signal<string | null>(null);
  protected readonly selectedDepartmentId = signal<string | null>(null);

  protected readonly categories = this.repository.getCategories();
  protected readonly departments = this.repository.getDepartments();
  protected readonly quickActions = this.repository.getQuickActions();

  protected readonly departmentNameMap = computed(() => {
    return Object.fromEntries(this.departments.map((department) => [department.id, department.name]));
  });

  protected readonly contextCategory = computed(() => {
    if (this.contextType() === 'category') {
      return this.repository.getCategoryById(this.contextId());
    }

    const linkedCategory = this.repository.getCategoriesForDepartment(this.contextId())[0];
    return linkedCategory;
  });

  protected readonly contextDepartment = computed(() => {
    if (this.contextType() === 'department') {
      return this.repository.getDepartmentById(this.contextId());
    }

    return undefined;
  });

  protected readonly groups = computed(() => {
    if (this.contextType() === 'category') {
      return this.repository.getGroupsByCategory(this.contextId());
    }

    return this.repository.getGroupsByDepartment(this.contextId());
  });

  protected readonly relevantDepartments = computed(() => {
    if (this.contextType() !== 'category') {
      return [];
    }

    return this.repository.getDepartmentsForCategory(this.contextId());
  });

  protected readonly actionCounts = computed(() => {
    const counts: Record<string, number> = {};

    for (const item of this.quickActions) {
      counts[item.action] = this.repository.getActionCountForContext(item.action, {
        categoryId: this.contextType() === 'category' ? this.contextId() : undefined,
        departmentId: this.contextType() === 'department' ? this.contextId() : this.selectedDepartmentId() ?? undefined,
        groupId: this.selectedGroupId() ?? undefined,
      });
    }

    return counts;
  });

  protected readonly filteredServices = computed(() => {
    const filters: ServiceFilters = {
      categoryId: this.contextType() === 'category' ? this.contextId() : undefined,
      departmentId:
        this.contextType() === 'department' ? this.contextId() : this.selectedDepartmentId() ?? undefined,
      groupId: this.selectedGroupId() ?? undefined,
      searchQuery: this.searchQuery() || undefined,
      action: this.selectedAction() ?? undefined,
    };

    return this.repository.getServices(filters);
  });

  protected readonly previewServices = computed<ServiceItem[]>(() => {
    return this.filteredServices().slice(0, 6);
  });

  protected readonly breadcrumb = computed(() => {
    if (this.contextType() === 'category') {
      return `Home / Category / ${this.contextCategory()?.nameHindi ?? ''}`;
    }

    return `Home / Department / ${this.contextDepartment()?.name ?? ''}`;
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const type = (params.get('type') as 'category' | 'department') ?? 'category';
      const id = params.get('id') ?? '';

      this.contextType.set(type);
      this.contextId.set(id);
      this.searchQuery.set('');
      this.selectedAction.set(null);
      this.selectedGroupId.set(null);
      this.selectedDepartmentId.set(null);
    });
  }

  onSearchChange(value: string): void {
    this.searchQuery.set(value);
  }

  onSearchSubmit(value: string): void {
    this.searchQuery.set(value);
  }

  onGroupChange(groupId: string | null): void {
    this.selectedGroupId.set(groupId);
  }

  onDepartmentChange(departmentId: string | null): void {
    this.selectedDepartmentId.set(departmentId);
  }

  onActionChange(action: ServiceAction | null): void {
    this.selectedAction.set(action);
  }

  openService(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }

  openFullListing(): void {
    this.router.navigate(['/services'], {
      queryParams: {
        categoryId: this.contextType() === 'category' ? this.contextId() : undefined,
        departmentId:
          this.contextType() === 'department' ? this.contextId() : this.selectedDepartmentId() ?? undefined,
        groupId: this.selectedGroupId() ?? undefined,
        action: this.selectedAction() ?? undefined,
        q: this.searchQuery() || undefined,
      },
    });
  }
}

