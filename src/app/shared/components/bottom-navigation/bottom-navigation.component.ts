import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-navigation.component.html',
  styleUrl: './bottom-navigation.component.scss',
})
export class BottomNavigationComponent {
  protected readonly navItems = [
    { label: 'होम', icon: 'home', route: '/home', exact: true },
    { label: 'सेवाएं', icon: 'grid_view', route: '/browse/category/all', exact: false },
    { label: 'अर्जी', icon: 'description', route: '/applications', exact: false },
    { label: 'प्रोफ़ाइल', icon: 'person', route: '/profile', exact: false },
  ];
}

