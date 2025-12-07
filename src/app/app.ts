import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header.component';
import { IllustrationFormComponent } from './components/illustration-form.component';
import { LanguageService } from './services/language.service';
import { DailyIllustrationService } from './services/daily-illustration.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, IllustrationFormComponent, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class ZipixitApp implements OnInit {
  protected readonly title = signal('ZIPixit');

  dailyIllustService = signal<DailyIllustrationService | null>(null);

  constructor(private dailyIllustrationService: DailyIllustrationService, public languageService: LanguageService) {}

  ngOnInit(): void {
    this.dailyIllustService.set(this.dailyIllustrationService);
  }

  get illustTitle(): string {
    const dailyIllust = this.dailyIllustrationService.dailyIllustration();
    return dailyIllust ? dailyIllust.title : '';
  }

  get illustArtist(): string {
    const dailyIllust = this.dailyIllustrationService.dailyIllustration();
    return dailyIllust ? dailyIllust.artist : '';
  }
}
