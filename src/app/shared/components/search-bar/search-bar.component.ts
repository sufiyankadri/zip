import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  readonly value = input('');
  readonly placeholder = input('सेवा, योजना या प्रमाणपत्र खोजें');
  readonly sticky = input(false);
  readonly compact = input(false);

  readonly valueChange = output<string>();
  readonly submitted = output<string>();

  onInput(event: Event): void {
    const nextValue = (event.target as HTMLInputElement).value;
    this.valueChange.emit(nextValue);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.emit(this.value());
  }
}


