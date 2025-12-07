import { Inject, Injectable, signal, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

export interface DailyIllustration {
  id: number;
  title: string;
  artist: string;
  image_base64: string;
}

@Injectable({
  providedIn: 'root'
})
export class DailyIllustrationService {
  dailyIllustration = signal<DailyIllustration | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    // Only load in browser and not during server-side rendering or build
    if(isPlatformBrowser(this.platformId)) {
        this.loadDailyIllustration();
    }
  }

  loadDailyIllustration(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<DailyIllustration>(`api/daily_top_illust`)
      .subscribe({
        next: (data) => {
          console.log('Daily illustration data loaded:', data);
          this.dailyIllustration.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading daily illustration:', err);
          this.error.set('Failed to load daily illustration');
          this.isLoading.set(false);
        }
      });
  }
}