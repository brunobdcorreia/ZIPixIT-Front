import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadedImage } from '../services/socket.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-image-gallery',
  imports: [CommonModule],
  template: `
    <div 
      class="gallery-container" 
      *ngIf="images().length > 0"
      [class.minimized]="isMinimized()"
    >

      <div class="gallery-drag-handle">
        <button 
          class="minimize-button" 
          (click)="toggleMinimize()"
          [title]="isMinimized() ? 'Expand gallery' : 'Minimize gallery'"
          type="button"
        >
          {{ isMinimized() ? '▲' : '▼' }}
        </button>
        
        <div class="drag-indicator"></div>
      </div>


      <div class="gallery-content" *ngIf="!isMinimized()">
        <div class="gallery-header">
          <h3>{{ images().length }} {{ languageService.getTranslation('downloadedImagesNumber') }}</h3>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="(images().length / totalImages()) * 100"></div>
          </div>
        </div>
        
        <div class="gallery-grid">
          <div class="gallery-item" *ngFor="let image of images()">
            <img [src]="image.imageData" [alt]="image.filename" class="gallery-image" />
            <div class="gallery-info">
              <span class="image-index">{{ image.index }}</span>
              <span class="image-filename">{{ image.filename }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './image-gallery.component.css'
})
export class ImageGalleryComponent {
  @Input() images = signal<DownloadedImage[]>([]);
  @Input() totalImages = signal(0);

  isMinimized = signal(false);

  constructor(public languageService: LanguageService) {}

  toggleMinimize(): void {
    this.isMinimized.update(val => !val);
  }
}