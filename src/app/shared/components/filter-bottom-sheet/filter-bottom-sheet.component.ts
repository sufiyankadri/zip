import { CommonModule } from '@angular/common';
import { Component, OnChanges, SimpleChanges, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Department, ServiceAction, ServiceGroup, ServiceMode } from '../../../core/models/service.models';

export interface AdvancedFilterSelection {
  groupId?: string;
  departmentId?: string;
  mode?: ServiceMode;
  samagraEnabled?: boolean;
  action?: ServiceAction;
}

@Component({
  selector: 'app-filter-bottom-sheet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-bottom-sheet.component.html',
  styleUrl: './filter-bottom-sheet.component.scss',
})
export class FilterBottomSheetComponent implements OnChanges {
  readonly open = input(false);
  readonly groups = input.required<ServiceGroup[]>();
  readonly departments = input.required<Department[]>();
  readonly selected = input<AdvancedFilterSelection>({});

  readonly closeSheet = output<void>();
  readonly applyFilters = output<AdvancedFilterSelection>();

  localSelection: AdvancedFilterSelection = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selected'] || changes['open']) {
      this.localSelection = { ...this.selected() };
    }
  }

  clearFilters(): void {
    this.localSelection = {};
  }

  apply(): void {
    this.applyFilters.emit({ ...this.localSelection });
    this.closeSheet.emit();
  }
}

