import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApplicationSummary } from '../../../core/models/service.models';

@Component({
  selector: 'app-application-summary-cards',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './application-summary-cards.component.html',
  styleUrl: './application-summary-cards.component.scss',
})
export class ApplicationSummaryCardsComponent {
  readonly summary = input.required<ApplicationSummary>();

  protected readonly cardConfig = [
    { key: 'totalSubmitted', label: 'Submitted', icon: 'assignment_turned_in' },
    { key: 'pending', label: 'Pending', icon: 'hourglass_empty' },
    { key: 'approved', label: 'Approved', icon: 'check_circle' },
    { key: 'rejected', label: 'Rejected', icon: 'cancel' },
    { key: 'readyForDownload', label: 'Ready', icon: 'download' },
  ] as const;

  getValue(key: keyof ApplicationSummary): number {
    return this.summary()[key];
  }
}

