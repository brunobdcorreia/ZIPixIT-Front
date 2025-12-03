import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-message',
  imports: [CommonModule],
  template: `
    <div *ngIf="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  `,
  styleUrl: './error-message.component.css'
})
export class ErrorMessageComponent {
  @Input() errorMessage: string | null = null;
}