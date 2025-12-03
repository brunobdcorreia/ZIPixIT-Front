import { Component, signal } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-range-tooltip',
  imports: [],
  template: `
    <span class="illust-range-tooltip-icon">
      <span class="illust-range-tooltip-text">
        {{ languageService.getTranslation('tooltipText')}}
      </span>
      ?
    </span>
  `,
  styleUrl: './range-tooltip.component.css'
})
export class RangeTooltipComponent {
  constructor(public languageService: LanguageService) {}
}