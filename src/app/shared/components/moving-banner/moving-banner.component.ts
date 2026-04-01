import { Component, input } from '@angular/core';

import { BannerItem } from '../../../core/models/service.models';

@Component({
  selector: 'app-moving-banner',
  standalone: true,
  templateUrl: './moving-banner.component.html',
  styleUrl: './moving-banner.component.scss',
})
export class MovingBannerComponent {
  readonly banners = input.required<BannerItem[]>();
}

