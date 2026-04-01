import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-browse-toggle',
  standalone: true,
  templateUrl: './browse-toggle.component.html',
  styleUrl: './browse-toggle.component.scss',
})
export class BrowseToggleComponent {
  readonly selected = input<'category' | 'department'>('category');
  readonly selectedChange = output<'category' | 'department'>();

  setTab(tab: 'category' | 'department'): void {
    this.selectedChange.emit(tab);
  }
}

