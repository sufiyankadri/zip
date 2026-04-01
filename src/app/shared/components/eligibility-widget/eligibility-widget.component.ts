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

  readonly checkWithoutSamagra = output<void>();
  readonly openEligibleSchemes = output<void>();
}

