import { Component, computed, input, output } from '@angular/core';

import { Department } from '../../../core/models/service.models';

@Component({
  selector: 'app-department-list',
  standalone: true,
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss',
})
export class DepartmentListComponent {
  readonly departments = input.required<Department[]>();
  readonly title = input('Departments');
  readonly subtitle = input('Select a department to narrow services');
  readonly homeEnhanced = input(false);
  readonly departmentSelect = output<Department>();
  readonly viewAll = output<void>();

  protected readonly moreDepartments = computed(() => {
    if (!this.homeEnhanced()) {
      return [];
    }
    const all = this.departments();
    if (all.length <= 6) {
      return [];
    }
    return all.slice(5);
  });
  protected readonly topDepartments = computed(() => {
    if (!this.homeEnhanced()) {
      return this.departments();
    }
    const all = this.departments();
    if (all.length <= 6) {
      return all.slice(0, 6);
    }
    return all.slice(0, 5);
  });
}

