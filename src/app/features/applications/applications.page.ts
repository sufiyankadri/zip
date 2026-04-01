import { Component, inject } from '@angular/core';

import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { ApplicationSummaryCardsComponent } from '../../shared/components/application-summary-cards/application-summary-cards.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-applications-page',
  standalone: true,
  imports: [ApplicationSummaryCardsComponent, TopHeaderComponent],
  templateUrl: './applications.page.html',
  styleUrl: './applications.page.scss',
})
export class ApplicationsPage {
  private readonly repository = inject(ServiceRepositoryService);

  protected readonly summary = this.repository.getDefaultApplicationSummary();

  protected readonly sampleApplications = [
    {
      id: 'APP-220145',
      service: 'आय प्रमाणपत्र आवेदन',
      status: 'Pending Verification',
      updatedAt: '19 Mar 2026',
    },
    {
      id: 'APP-220011',
      service: 'राशन कार्ड सदस्य संशोधन',
      status: 'Approved',
      updatedAt: '15 Mar 2026',
    },
    {
      id: 'APP-219878',
      service: 'ड्राइविंग लाइसेंस नवीनीकरण',
      status: 'Ready for Download',
      updatedAt: '13 Mar 2026',
    },
  ];
}

