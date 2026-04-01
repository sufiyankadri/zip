import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { BrowseToggleComponent } from '../../shared/components/browse-toggle/browse-toggle.component';
import { CategoryCardGridComponent } from '../../shared/components/category-card-grid/category-card-grid.component';
import { DepartmentListComponent } from '../../shared/components/department-list/department-list.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-browse-page',
  standalone: true,
  imports: [
    BrowseToggleComponent,
    CategoryCardGridComponent,
    DepartmentListComponent,
    SearchBarComponent,
    TopHeaderComponent,
  ],
  templateUrl: './browse.page.html',
  styleUrl: './browse.page.scss',
})
export class BrowsePage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly mode = signal<'category' | 'department'>('category');
  protected readonly selectedId = signal<string | null>(null);
  protected readonly query = signal('');

  private readonly categories = this.repository.getCategories();
  private readonly departments = this.repository.getDepartments();

  protected readonly filteredCategories = computed(() => {
    const search = this.query().trim().toLowerCase();
    if (!search) {
      return this.categories;
    }

    return this.categories.filter((category) =>
      `${category.nameHindi} ${category.nameEnglish} ${category.description}`.toLowerCase().includes(search),
    );
  });

  protected readonly filteredDepartments = computed(() => {
    const search = this.query().trim().toLowerCase();
    if (!search) {
      return this.departments;
    }

    return this.departments.filter((department) =>
      `${department.name} ${department.description}`.toLowerCase().includes(search),
    );
  });

  constructor() {
    this.route.data.subscribe((data) => {
      const mode = (data['mode'] as 'category' | 'department') ?? 'category';
      this.mode.set(mode);
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.selectedId.set(id && id !== 'all' ? id : null);
    });
  }

  onSearchChange(value: string): void {
    this.query.set(value);
  }

  onToggle(mode: 'category' | 'department'): void {
    this.router.navigate([`/browse/${mode}/all`]);
  }

  openCategory(categoryId: string): void {
    this.router.navigate(['/group', 'category', categoryId]);
  }

  openDepartment(departmentId: string): void {
    this.router.navigate(['/group', 'department', departmentId]);
  }
}

