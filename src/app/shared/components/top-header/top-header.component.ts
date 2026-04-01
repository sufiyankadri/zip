import { Location } from '@angular/common';
import { Component, input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-header',
  standalone: true,
  imports: [],
  templateUrl: './top-header.component.html',
  styleUrl: './top-header.component.scss',
})
export class TopHeaderComponent {
  readonly title = input('MP eSeva');
  readonly subtitle = input('Citizen Service Portal');
  readonly showBack = input(false);
  readonly backRoute = input<string | null>(null);
  readonly showProfile = input(true);
  readonly showHelp = input(true);

  constructor(
    private readonly location: Location,
    private readonly router: Router,
  ) {}

  goBack(): void {
    const route = this.backRoute();
    if (route) {
      this.router.navigateByUrl(route);
      return;
    }

    this.location.back();
  }
}

