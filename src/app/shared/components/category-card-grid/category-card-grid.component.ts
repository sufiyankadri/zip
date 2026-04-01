import { Component, input, output } from '@angular/core';

import { Category } from '../../../core/models/service.models';

@Component({
  selector: 'app-category-card-grid',
  standalone: true,
  templateUrl: './category-card-grid.component.html',
  styleUrl: './category-card-grid.component.scss',
})
export class CategoryCardGridComponent {
  readonly categories = input.required<Category[]>();
  readonly categorySelect = output<Category>();
}

