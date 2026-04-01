import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ServiceRepositoryService } from '../../core/services/service-repository.service';
import { ServiceDetailSectionsComponent } from '../../shared/components/service-detail-sections/service-detail-sections.component';
import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-service-detail-page',
  standalone: true,
  imports: [ServiceDetailSectionsComponent, TopHeaderComponent],
  templateUrl: './service-detail.page.html',
  styleUrl: './service-detail.page.scss',
})
export class ServiceDetailPage {
  private readonly repository = inject(ServiceRepositoryService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly serviceId = signal<string | null>(null);

  protected readonly service = computed(() => this.repository.getServiceById(this.serviceId()));
  protected readonly category = computed(() => this.repository.getCategoryById(this.service()?.categoryId));
  protected readonly group = computed(() => this.repository.getGroupById(this.service()?.groupId));
  protected readonly department = computed(() => this.repository.getDepartmentById(this.service()?.departmentId));

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.serviceId.set(params.get('id'));
    });
  }

  goToListing(): void {
    if (!this.service()) {
      return;
    }

    this.router.navigate(['/services'], {
      queryParams: {
        categoryId: this.service()!.categoryId,
        groupId: this.service()!.groupId,
      },
    });
  }
}
