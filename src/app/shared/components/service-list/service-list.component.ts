import { Component, input, output } from '@angular/core';

import { ServiceAction, ServiceItem } from '../../../core/models/service.models';
import { ServiceCardComponent } from '../service-card/service-card.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [ServiceCardComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss',
})
export class ServiceListComponent {
  readonly services = input.required<ServiceItem[]>();
  readonly departmentNameMap = input<Record<string, string>>({});
  readonly compact = input(false);

  readonly viewDetails = output<string>();
  readonly actionClick = output<{ serviceId: string; action: ServiceAction }>();

  getDepartmentName(departmentId: string): string {
    return this.departmentNameMap()[departmentId] ?? 'Department';
  }
}

