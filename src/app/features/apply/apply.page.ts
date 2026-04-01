import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ApplicationStoreService } from '../../core/services/application-store.service';
import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-apply-page',
  standalone: true,
  imports: [ReactiveFormsModule, TopHeaderComponent],
  templateUrl: './apply.page.html',
  styleUrl: './apply.page.scss',
})
export class ApplyPage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly applicationStore = inject(ApplicationStoreService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly serviceId = signal<string | null>(null);
  protected readonly formSubmitAttempted = signal(false);

  protected readonly service = computed(() => this.repository.getServiceById(this.serviceId()));

  protected readonly applicationForm = this.formBuilder.nonNullable.group({
    applicantName: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    samagraId: ['', [Validators.pattern(/^\d{9}$/)]],
    address: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.serviceId.set(params.get('id'));
    });
  }

  protected submitApplication(): void {
    if (!this.service()) {
      return;
    }

    this.formSubmitAttempted.set(true);
    this.applicationForm.markAllAsTouched();
    if (this.applicationForm.invalid) {
      return;
    }

    const values = this.applicationForm.getRawValue();
    this.applicationStore.submitApplication({
      serviceId: this.service()!.id,
      service: this.service()!.serviceName,
      applicantName: values.applicantName,
      mobile: values.mobile,
      samagraId: values.samagraId,
      address: values.address,
    });

    this.router.navigate(['/applications']);
  }
}
