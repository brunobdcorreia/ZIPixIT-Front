import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZipixivService } from '../services/zipixiv.service';
import { LanguageService } from '../services/language.service';
import { RangeTooltipComponent } from './range-tooltip.component';
import { ErrorMessageComponent } from './error-message.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-illustration-form',
  imports: [CommonModule, FormsModule, RangeTooltipComponent, ErrorMessageComponent],
  template: `
    <div class="subtitle" [innerHTML]="subtitleHtml"></div>
    <form (ngSubmit)="onSubmit()">
      <div class="full-width-container url-input-wrapper">
        <input 
          class="illust-url-input" 
          name="illust_url" 
          type="text" 
          autocomplete="off"
          [placeholder]="languageService.getTranslation('enterUrl')"
          [(ngModel)]="illustUrl"
          required
        />
      </div>  
      <div class="row-container">
        <input
          class="illust-range-input"
          name="illust_range"
          type="text"
          autocomplete="off"
          pattern="[0-9\-]+"
          inputmode="numeric"
          [placeholder]="languageService.getTranslation('enterRange')"
          [(ngModel)]="illustRange"
        />
        <app-range-tooltip></app-range-tooltip>
      </div>
      <div class="full-width-container radio-wrapper">
        <div class="radio-group">
          <input id="zip" type="radio" [(ngModel)]="compressionFormat"  name="compression_format" value="zip" checked/>
          <label for="zip">.zip</label>
          <input id="7z" type="radio" [(ngModel)]="compressionFormat"  name="compression_format" value="7z"/>
          <label for="7z">.7z</label>
          <input id="tar.gz" type="radio" [(ngModel)]="compressionFormat"  name="compression_format" value="tar.gz"/>
          <label for="tar.gz">.tar.gz</label>
        </div>
      </div>  
      <div class="full-width-container button-wrapper">
        <button class="download-button" type="submit" [disabled]="isLoading()">
          {{ isLoading() ? languageService.getTranslation('downloading') : languageService.getTranslation('download') }}
        </button>
      </div>
    </form>
    
    <app-error-message [errorMessage]="errorMessage()"></app-error-message>
  `,
  styleUrl: './illustration-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class IllustrationFormComponent {
  illustUrl = signal('');
  illustRange = signal('');
  compressionFormat = signal('zip');
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private zipixivService: ZipixivService,
    private sanitizer: DomSanitizer,
    public languageService: LanguageService
  ) {}

  get subtitleHtml(): SafeHtml {
    const rawHtml = this.languageService.getTranslation('subtitle');
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  onSubmit(): void {
    if (!this.illustUrl()) {
      this.errorMessage.set(this.languageService.getTranslation('invalidUrl'));
      return;
    }
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.compressionFormat.set(this.compressionFormat() || 'zip');
    console.log(`Selected compression format: ${this.compressionFormat()}`);

    this.zipixivService.downloadIllustrations(
      this.illustUrl(),
      this.compressionFormat(),
      this.illustRange() || undefined
    ).subscribe({
      next: (response) => {
        const url = window.URL.createObjectURL(response.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = response.filename;
        link.click();
        window.URL.revokeObjectURL(url);
        this.isLoading.set(false);
        this.illustUrl.set('');
        this.illustRange.set('');
      },
      error: (error) => {
        this.errorMessage.set(this.languageService.getTranslation('failedDownload'));
        this.isLoading.set(false);
      }
    });
  }
}