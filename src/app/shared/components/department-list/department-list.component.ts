import { Component, input, output } from '@angular/core';

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
  readonly departmentSelect = output<Department>();
}

