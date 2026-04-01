import { Routes } from '@angular/router';

import { ApplicationsPage } from './features/applications/applications.page';
import { ApplyPage } from './features/apply/apply.page';
import { BrowsePage } from './features/browse/browse.page';
import { ServiceGroupPage } from './features/group/service-group.page';
import { HomePage } from './features/home/home.page';
import { ServiceListingPage } from './features/listing/service-listing.page';
import { ProfilePage } from './features/profile/profile.page';
import { SearchPage } from './features/search/search.page';
import { ServiceDetailPage } from './features/service-detail/service-detail.page';
import { AppShellComponent } from './shared/components/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomePage },
      { path: 'browse/category/:id', component: BrowsePage, data: { mode: 'category' } },
      { path: 'browse/department/:id', component: BrowsePage, data: { mode: 'department' } },
      { path: 'group/:type/:id', component: ServiceGroupPage },
      { path: 'services', component: ServiceListingPage },
      { path: 'search', component: SearchPage },
      { path: 'service/:id', component: ServiceDetailPage },
      { path: 'service/:id/apply', component: ApplyPage },
      { path: 'applications', component: ApplicationsPage },
      { path: 'profile', component: ProfilePage },
      { path: '**', redirectTo: 'home' },
    ],
  },
];

