import { Component, input, output } from '@angular/core';

import { ServiceAction, ServiceItem } from '../../../core/models/service.models';

@Component({
  selector: 'app-service-card',
  standalone: true,
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.scss',
})
export class ServiceCardComponent {
  readonly service = input.required<ServiceItem>();
  readonly departmentName = input('');
  readonly compact = input(false);

  readonly viewDetails = output<string>();
  readonly actionClick = output<{ serviceId: string; action: ServiceAction }>();

  onAction(action: ServiceAction): void {
    this.actionClick.emit({ serviceId: this.service().id, action });
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.service().id);
  }
}

