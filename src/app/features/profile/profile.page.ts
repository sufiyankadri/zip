import { Component } from '@angular/core';

import { TopHeaderComponent } from '../../shared/components/top-header/top-header.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [TopHeaderComponent],
  templateUrl: './profile.page.html',
  styleUrl: './profile.page.scss',
})
export class ProfilePage {
  protected readonly settings = [
    { icon: 'badge', label: 'Citizen Profile', sublabel: 'Manage basic profile details' },
    { icon: 'language', label: 'Language', sublabel: 'हिंदी / English preferences' },
    { icon: 'notifications', label: 'Notifications', sublabel: 'Status alerts and reminders' },
    { icon: 'contact_support', label: 'Help and Support', sublabel: 'FAQ and helpline support' },
  ];
}

