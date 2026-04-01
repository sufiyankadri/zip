import { Component, input, output } from '@angular/core';

import { Department } from '../../../core/models/service.models';

@Component({
  selector: 'app-department-filter-list',
  standalone: true,
  templateUrl: './department-filter-list.component.html',
  styleUrl: './department-filter-list.component.scss',
})
export class DepartmentFilterListComponent {
  readonly departments = input.required<Department[]>();
  readonly selectedDepartmentId = input<string | null>(null);
  readonly departmentSelect = output<string | null>();

  toggle(departmentId: string): void {
    this.departmentSelect.emit(this.selectedDepartmentId() === departmentId ? null : departmentId);
  }
}

