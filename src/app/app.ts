import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header.component';
import { IllustrationFormComponent } from './components/illustration-form.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, IllustrationFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class ZipixitApp {
  protected readonly title = signal('ZIPixit');
}
