import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { AboutModalComponent } from './about-modal.component';

@Component({
  selector: 'app-header',
  imports: [CommonModule, AboutModalComponent],
  template: `
    <header class="toolbar">
      <div class="toolbar-left">
        <h1 class="app-title">{{ title() }}</h1>
      </div>

      <div class="toolbar-right">
        <button class="about-button" (click)="onAboutClick()">
          {{ languageService.getTranslation('about') }}
        </button>
        
        <div class="language-dropdown-container">
          <button 
            class="language-button" 
            (click)="toggleLanguageDropdown()"
            [title]="'Current language: ' + languageService.currentLanguage()"
          >
            🌐
          </button>

          <div class="language-dropdown" *ngIf="showLanguageDropdown()">
            <button 
              *ngFor="let lang of languageService.availableLanguages"
              class="language-option"
              [class.active]="languageService.currentLanguage() === lang"
              (click)="selectLanguage(lang)"
            >
              {{ getLanguageName(lang) }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <app-about-modal 
      [isOpen]="showAboutModal()" 
      (close)="closeAboutModal()"
    ></app-about-modal>
  `,
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() title!: () => string;

  showLanguageDropdown = signal(false);
  showAboutModal = signal(false);

  languageNames: Record<string, string> = {
    en: 'English',
    ja: '日本語'
  };

  constructor(public languageService: LanguageService) {}

  toggleLanguageDropdown(): void {
    this.showLanguageDropdown.update(value => !value);
  }

  selectLanguage(lang: string): void {
    this.languageService.setLanguage(lang as any);
    this.showLanguageDropdown.set(false);
  }

  getLanguageName(lang: string): string {
    return this.languageNames[lang] || lang.toUpperCase();
  }

  onAboutClick(): void {
    this.showAboutModal.set(true);
  }

  closeAboutModal(): void {
    this.showAboutModal.set(false);
  }
}