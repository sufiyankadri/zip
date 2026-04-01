import { Component, input } from '@angular/core';

import { ServiceItem } from '../../../core/models/service.models';

@Component({
  selector: 'app-service-detail-sections',
  standalone: true,
  templateUrl: './service-detail-sections.component.html',
  styleUrl: './service-detail-sections.component.scss',
})
export class ServiceDetailSectionsComponent {
  readonly service = input.required<ServiceItem>();
}

