import { Component, signal, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZipixivService } from '../services/zipixiv.service';
import { DownloadProgress, SocketService } from '../services/socket.service';
import { LanguageService } from '../services/language.service';
import { RangeTooltipComponent } from './range-tooltip.component';
import { ErrorMessageComponent } from './error-message.component';
import { ImageGalleryComponent } from './image-gallery.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-illustration-form',
  imports: [
    CommonModule, 
    FormsModule, 
    RangeTooltipComponent, 
    ErrorMessageComponent,
    ImageGalleryComponent
  ],
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
          [disabled]="isLoading()"
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
          [disabled]="isLoading()"
        />
        <app-range-tooltip></app-range-tooltip>
      </div>

      <!-- Compression Format Selection -->
      <div class="full-width-container radio-wrapper">
        <div class="radio-group">
          <input 
            id="zip" 
            type="radio" 
            [(ngModel)]="compressionFormat"  
            name="compression_format" 
            value="zip"
            [disabled]="isLoading()"
            checked
          />
          <label for="zip">.zip</label>
          <input 
            id="7z" 
            type="radio" 
            [(ngModel)]="compressionFormat"  
            name="compression_format" 
            value="7z"
            [disabled]="isLoading()"
          />
          <label for="7z">.7z</label>
          <input 
            id="tar.gz" 
            type="radio" 
            [(ngModel)]="compressionFormat"  
            name="compression_format" 
            value="tar.gz"
            [disabled]="isLoading()"
          />
          <label for="tar.gz">.tar.gz</label>
        </div>
      </div>

      <!-- Live Display Toggle -->
      <div class="full-width-container toggle-wrapper">
        <label class="toggle-label">
          <input 
            type="checkbox" 
            [(ngModel)]="showLiveDisplay"
            name="show-live-display"
            [disabled]="isLoading()"
            class="toggle-checkbox"
          />
          <span class="toggle-text">{{ languageService.getTranslation('showImagesAsTheyDownload') }}</span>
        </label>
      </div>

      <div class="full-width-container button-wrapper">
        <button class="download-button" type="submit" [disabled]="isLoading()">
          {{ isLoading() ? languageService.getTranslation('downloading') : languageService.getTranslation('download') }}
        </button>
      </div>
    </form>

    <!-- Display Download Progress -->
    <div class="progress-container" *ngIf="downloadProgress$ | async as progress">
      <p class="progress-message">{{ progress.message }}</p>
    </div>

    <!-- Display Errors -->
    <app-error-message [errorMessage]="errorMessage()"></app-error-message>

    <!-- Display Live Images if Toggled On -->
    <app-image-gallery 
      *ngIf="showLiveDisplay()"
      [images]="socketService.downloadedImages"
      [totalImages]="totalDownloadImages"
    ></app-image-gallery>
  `,
  styleUrl: './illustration-form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class IllustrationFormComponent {
  illustUrl = signal('');
  illustRange = signal('');
  compressionFormat = signal('zip');
  showLiveDisplay = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');
  totalDownloadImages = signal(0);

  downloadProgress$: Observable<DownloadProgress | null> | null = null;

  constructor(
    private zipixivService: ZipixivService,
    public socketService: SocketService,
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

    if (this.showLiveDisplay()) {
      this.downloadViaWebSocket();
    } else {
      this.downloadViaAPI();
    }
  }

  private downloadViaWebSocket(): void {
    // Reset gallery
    this.socketService.downloadedImages.set([]);

    // Subscribe to download completion
    const completionSub = this.socketService.downloadCompleted.subscribe(completed => {
      if (completed) {
        this.isLoading.set(false);
        this.illustUrl.set('');
        this.illustRange.set('');
        completionSub.unsubscribe();
      }
    });

    // Subscribe to errors
    const errorSub = this.socketService.downloadError.subscribe(error => {
      if (error) {
        this.errorMessage.set(error);
        this.isLoading.set(false);
        errorSub.unsubscribe();
      }
    });

    console.log("Format selected:", this.compressionFormat());
    // Start WebSocket download
    this.socketService.startWebSocketDownload(
      this.illustUrl(),
      this.illustRange() || '',
      this.compressionFormat(),
    );
  }

  private downloadViaAPI(): void {
    this.zipixivService.downloadIllustrations(
      this.illustUrl(),
      this.illustRange() || '',
      this.compressionFormat(),
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