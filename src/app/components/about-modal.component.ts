import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-about-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" *ngIf="isVisible" (click)="onOverlayClick()" [class.is-open]="isOpen">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{languageService.getTranslation('about')}}</h2>
          <button class="close-button" (click)="close.emit()">✕</button>
        </div>
        
        <div class="modal-body" [innerHTML]="aboutHtml"></div>

        <div class="modal-footer">
          <button class="modal-button" (click)="close.emit()">Close</button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './about-modal.component.css'
})
export class AboutModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();
  public isVisible = false;
  private animationDuration = 300;

  constructor(public languageService: LanguageService, private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      // When isOpen becomes true, instantly make the element visible 
      // so the CSS transition can run the fade-in (0 to 1).
      setTimeout(() => this.isVisible = true, 0); 
    }
  }

  get aboutHtml(): SafeHtml {
    const rawHtml = this.languageService.getTranslation('aboutText');
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  // Handle closing logic for fade-out
  onClose(): void {
    // 1. Start the CSS fade-out transition by removing the 'is-open' class
    this.isVisible = false; 

    // 2. Wait for the transition to complete (300ms)
    setTimeout(() => {
      // 3. Remove the component from the DOM only after the fade-out is done
      this.close.emit();
    }, this.animationDuration);
  }

  onOverlayClick(): void {
    this.close.emit();
  }
}