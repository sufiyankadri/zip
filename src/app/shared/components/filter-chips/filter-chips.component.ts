import { Component, input, output } from '@angular/core';

export interface FilterChip {
  id: string;
  label: string;
  active: boolean;
}

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  templateUrl: './filter-chips.component.html',
  styleUrl: './filter-chips.component.scss',
})
export class FilterChipsComponent {
  readonly chips = input.required<FilterChip[]>();
  readonly chipToggle = output<string>();
}

