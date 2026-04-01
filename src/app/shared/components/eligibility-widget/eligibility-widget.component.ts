import { Component, input, output } from '@angular/core';

import { EligibilityState } from '../../../core/models/service.models';

@Component({
  selector: 'app-eligibility-widget',
  standalone: true,
  templateUrl: './eligibility-widget.component.html',
  styleUrl: './eligibility-widget.component.scss',
})
export class EligibilityWidgetComponent {
  readonly state = input.required<EligibilityState>();
  readonly samagraId = input<string>('');

  readonly checkWithoutSamagra = output<void>();
  readonly openEligibleSchemes = output<void>();
  readonly samagraIdChange = output<string>();
  readonly searchWithSamagra = output<string>();

  onSamagraInput(value: string): void {
    this.samagraIdChange.emit(value);
  }

  onSearch(): void {
    this.searchWithSamagra.emit(this.samagraId().trim());
  }
}

