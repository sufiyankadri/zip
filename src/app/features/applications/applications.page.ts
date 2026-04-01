import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';

import { ApplicationStoreService } from '../../core/services/application-store.service';
import { ApplicationStatus } from '../../core/models/service.models';
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
  private readonly applicationStore = inject(ApplicationStoreService);

  private readonly baseSummary = this.repository.getDefaultApplicationSummary();
  private readonly submittedApplications = this.applicationStore.applications;
  protected readonly summary = computed(() => {
    const counts = this.applicationStore.getSummaryCounts();
    const submittedCount = this.submittedApplications().length;

    return {
      totalSubmitted: this.baseSummary.totalSubmitted + submittedCount,
      pending: this.baseSummary.pending + counts.Pending,
      approved: this.baseSummary.approved + counts['In Process'],
      rejected: this.baseSummary.rejected + counts.Submitted,
      readyForDownload: this.baseSummary.readyForDownload + counts.Completed,
    };
  });

  protected readonly sampleApplications = [
    {
      id: 'APP-220145',
      service: 'आय प्रमाणपत्र आवेदन',
      status: 'Pending',
      updatedAt: '19 Mar 2026',
    },
    {
      id: 'APP-220011',
      service: 'राशन कार्ड सदस्य संशोधन',
      status: 'In Process',
      updatedAt: '15 Mar 2026',
    },
    {
      id: 'APP-219878',
      service: 'ड्राइविंग लाइसेंस नवीनीकरण',
      status: 'Completed',
      updatedAt: '13 Mar 2026',
    },
  ];

  protected readonly applicationTimeline = computed(() => [...this.submittedApplications(), ...this.sampleApplications]);
  protected readonly progressStats = computed(() => {
    const summary = this.summary();
    return {
      queued: summary.pending,
      review: summary.pending,
      approved: summary.approved,
      delivered: summary.readyForDownload,
      rejected: summary.rejected,
    };
  });
  protected readonly selectedApplicationId = signal<string | null>(null);
  protected readonly timelineSectionRef = viewChild<ElementRef<HTMLElement>>('timelineSection');
  protected readonly selectedApplication = computed(() => {
    const id = this.selectedApplicationId();
    if (!id) {
      return null;
    }
    return this.applicationTimeline().find((app) => app.id === id) ?? null;
  });

  protected getStatusStep(status: string): number {
    const safeStatus = status as ApplicationStatus;
    if (safeStatus === 'Submitted') {
      return 1;
    }
    if (safeStatus === 'Pending') {
      return 2;
    }
    if (safeStatus === 'In Process') {
      return 3;
    }
    if (safeStatus === 'Completed') {
      return 4;
    }
    return 1;
  }

  protected getStatusLabel(status: string): string {
    const safeStatus = status as ApplicationStatus;
    if (safeStatus === 'Submitted') {
      return 'Submitted';
    }
    if (safeStatus === 'Pending') {
      return 'Pending';
    }
    if (safeStatus === 'In Process') {
      return 'In Process';
    }
    return 'Completed';
  }

  protected getPipelineStepLabel(index: number): string {
    const labels = ['Application Started', 'Verification', 'Department Review', 'Service Delivered'];
    return labels[index - 1] ?? '';
  }

  protected getProgressDetails(status: string, updatedAt: string): Array<{ label: string; date: string; done: boolean }> {
    const step = this.getStatusStep(status);
    const parsed = this.parseDate(updatedAt);
    const dates = [
      this.formatDateOffset(parsed, -3),
      this.formatDateOffset(parsed, -2),
      this.formatDateOffset(parsed, -1),
      this.formatDateOffset(parsed, 0),
    ];
    return [
      { label: 'Form Submitted', date: dates[0], done: step >= 1 },
      { label: 'Verification Desk', date: dates[1], done: step >= 2 },
      { label: 'Department Approval', date: dates[2], done: step >= 3 },
      { label: 'Final Certificate / Receipt', date: dates[3], done: step >= 4 },
    ];
  }

  protected openProgressSheet(applicationId: string): void {
    this.selectedApplicationId.set(applicationId);
  }

  protected closeProgressSheet(): void {
    this.selectedApplicationId.set(null);
  }

  protected scrollToRecentApplications(): void {
    this.timelineSectionRef()?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  protected canDownload(status: string): boolean {
    const safeStatus = status as ApplicationStatus;
    return safeStatus === 'Completed';
  }

  protected downloadReceipt(): void {
    const application = this.selectedApplication();
    if (!application || !this.canDownload(application.status)) {
      return;
    }

    const receiptContent = [
      'MP eSeva - Application Receipt',
      `Application ID: ${application.id}`,
      `Service: ${application.service}`,
      `Status: ${application.status}`,
      `Last Updated: ${application.updatedAt}`,
      '',
      'This is a system-generated receipt.',
    ].join('\n');

    const file = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${application.id}-receipt.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private parseDate(dateText: string): Date {
    const parsed = new Date(dateText);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
    return new Date();
  }

  private formatDateOffset(baseDate: Date, dayOffset: number): string {
    const nextDate = new Date(baseDate);
    nextDate.setDate(baseDate.getDate() + dayOffset);
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(nextDate);
  }
}

