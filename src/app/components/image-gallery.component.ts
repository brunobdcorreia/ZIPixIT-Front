import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadedImage } from '../services/socket.service';

@Component({
  selector: 'app-image-gallery',
  imports: [CommonModule],
  template: `
    <div class="gallery-container" *ngIf="images().length > 0">
      <div class="gallery-header">
        <h3>{{ images().length }} Images Downloaded</h3>
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
  `,
  styleUrl: './image-gallery.component.css'
})
export class ImageGalleryComponent {
  @Input() images = signal<DownloadedImage[]>([]);
  @Input() totalImages = signal(0);
}