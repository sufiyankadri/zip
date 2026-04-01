import { Component, computed, input, output } from '@angular/core';

import { Category } from '../../../core/models/service.models';

@Component({
  selector: 'app-category-card-grid',
  standalone: true,
  templateUrl: './category-card-grid.component.html',
  styleUrl: './category-card-grid.component.scss',
})
export class CategoryCardGridComponent {
  readonly categories = input.required<Category[]>();
  readonly homeEnhanced = input(false);
  readonly categorySelect = output<Category>();
  readonly viewAll = output<void>();

  private readonly homeVisibleCount = 6;

  protected readonly moreCategories = computed(() => {
    if (!this.homeEnhanced()) {
      return [];
    }
    const all = this.categories();
    if (all.length <= this.homeVisibleCount) {
      return [];
    }
    return all.slice(this.homeVisibleCount - 1);
  });

  protected readonly topCategories = computed(() => {
    if (!this.homeEnhanced()) {
      return this.categories();
    }
    const all = this.categories();
    if (all.length <= this.homeVisibleCount) {
      return all.slice(0, this.homeVisibleCount);
    }
    return all.slice(0, this.homeVisibleCount - 1);
  });

  protected readonly scrollingCategories = computed(() => {
    const more = this.moreCategories();
    return more.length > 0 ? [...more, ...more] : [];
  });
}

