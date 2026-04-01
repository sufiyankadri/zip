import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { BottomNavigationComponent } from '../bottom-navigation/bottom-navigation.component';

@Component({
  selector: 'app-app-shell',
  standalone: true,
  imports: [RouterOutlet, BottomNavigationComponent],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {}

