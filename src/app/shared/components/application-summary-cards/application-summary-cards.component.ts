import { Component, input, output } from '@angular/core';
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
  readonly allLink = input<string | null>('/applications');
  readonly allClicked = output<void>();

  protected readonly cardConfig = [
    { key: 'rejected', label: 'Submitted', icon: 'inventory_2', tone: 'submitted' },
    { key: 'pending', label: 'Pending', icon: 'pending_actions', tone: 'pending' },
    { key: 'approved', label: 'In Process', icon: 'task_alt', tone: 'inprocess' },
    { key: 'readyForDownload', label: 'Completed', icon: 'download_done', tone: 'completed' },
  ] as const;

  getValue(key: keyof ApplicationSummary): number {
    return this.summary()[key];
  }

  onAllClick(): void {
    this.allClicked.emit();
  }
}

