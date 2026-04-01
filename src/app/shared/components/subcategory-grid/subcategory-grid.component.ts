import { Component, input, output } from '@angular/core';

import { ServiceGroup } from '../../../core/models/service.models';

@Component({
  selector: 'app-subcategory-grid',
  standalone: true,
  templateUrl: './subcategory-grid.component.html',
  styleUrl: './subcategory-grid.component.scss',
})
export class SubcategoryGridComponent {
  readonly groups = input.required<ServiceGroup[]>();
  readonly selectedGroupId = input<string | null>(null);
  readonly groupSelect = output<string | null>();

  toggle(groupId: string): void {
    this.groupSelect.emit(this.selectedGroupId() === groupId ? null : groupId);
  }
}

