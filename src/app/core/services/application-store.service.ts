import { Injectable, computed, signal } from '@angular/core';

import { ApplicationStatus, SubmittedApplication } from '../models/service.models';

export interface ApplicationSubmissionPayload {
  serviceId: string;
  service: string;
  applicantName: string;
  mobile: string;
  samagraId?: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class ApplicationStoreService {
  private readonly applicationsState = signal<SubmittedApplication[]>([]);

  readonly applications = computed(() => this.applicationsState());

  submitApplication(payload: ApplicationSubmissionPayload): SubmittedApplication {
    const application: SubmittedApplication = {
      id: this.generateApplicationId(),
      serviceId: payload.serviceId,
      service: payload.service,
      applicantName: payload.applicantName.trim(),
      mobile: payload.mobile.trim(),
      samagraId: payload.samagraId?.trim() || undefined,
      address: payload.address.trim(),
      status: 'Pending Verification',
      updatedAt: this.formatDate(new Date()),
    };

    this.applicationsState.update((current) => [application, ...current]);
    return application;
  }

  getSummaryCounts(): Record<ApplicationStatus, number> {
    return this.applications().reduce(
      (acc, app) => {
        acc[app.status] += 1;
        return acc;
      },
      {
        'Pending Verification': 0,
        Approved: 0,
        'Ready for Download': 0,
        Rejected: 0,
      } as Record<ApplicationStatus, number>,
    );
  }

  private generateApplicationId(): string {
    const randomPart = Math.floor(100000 + Math.random() * 900000);
    return `APP-${randomPart}`;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }
}
