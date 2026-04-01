import { Component, input, output } from '@angular/core';

import { QuickAction, ServiceAction } from '../../../core/models/service.models';

@Component({
  selector: 'app-quick-action-grid',
  standalone: true,
  templateUrl: './quick-action-grid.component.html',
  styleUrl: './quick-action-grid.component.scss',
})
export class QuickActionGridComponent {
  readonly actions = input.required<QuickAction[]>();
  readonly selectedAction = input<ServiceAction | null>(null);
  readonly actionCounts = input<Record<string, number>>({});
  readonly actionSelect = output<ServiceAction | null>();

  toggle(action: ServiceAction): void {
    this.actionSelect.emit(this.selectedAction() === action ? null : action);
  }

  getCount(action: ServiceAction): number {
    return this.actionCounts()[action] ?? 0;
  }
}

