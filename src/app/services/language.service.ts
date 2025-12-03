import { Injectable, signal } from '@angular/core';

export type Language = 'en' | 'ja';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    title: 'ZIPixit',
    subtitle: `<p>
                Your favourite illustrations and manga,
              </p>  
              <p>
                easily zipped up and stored.
              </p>  
              `,
    enterUrl: '...xiv.net/../artworks/<illustration_id>',
    enterRange: 'Range (optional)',
    tooltipText: 'Specify a range of illustrations to download. Use \'-\' for open-ended ranges (e.g., \'5-\' for all from 5 onwards, \'-20\' for all up to 20).',
    download: 'Download',
    downloading: 'Downloading...',
    about: 'About',
    aboutText: `<p>
                  <strong>Zipixit</strong> is a simple tool designed to help you download illustrations from Pixiv.
                </p>
                <p>
                  Enter the URL of a Pixiv illustration, optionally specify a range of images to download, and choose your preferred archive format (ZIP, 7Z, or TAR).
                </p>
                <p>
                  The tool will download all the illustrations and package them into a single compressed file for easy storage and sharing.
                </p>`,
    invalidUrl: 'Please enter a valid Pixiv illustration URL',
    failedDownload: 'Failed to download illustrations'
  },
  ja: {
    title: 'ZIPixit',
    subtitle: `<h2>
                あなたのお気に入りなイラストや漫画を
              </h2>  
              <p>
                簡単に保存できる形で.
              </p>  
              `,
    enterUrl: '...xiv.net/../artworks/<illustration_id>',
    enterRange: '範囲（任意）',
    tooltipText: 'ダウンロードするイラストの範囲を指定してください。開放範囲には「-」を使用ください. (例:「5-」は5枚目の画像以降すべて、「-20」は20枚目の画像まですべて)',
    download: 'ダウンロード',
    downloading: 'ダウンロード中...',
    about: 'ZIPixitについて',
    aboutText: `<p>
                  <strong>Zipixit</strong>はPixivから簡単にイラストをダウンロードすることを優先し設計されたツール.
                </p>
                <p>
                  PixivのイラストIDを入力し任意でダウンロードする画像の数の範囲を指定し好きなファイル形式 (ZIP, 7Z, TAR等)を選んでください.
                </p>
                <p>
                  このツールは、すべてのイラストをダウンロードし、簡単に保存および共有できるように圧縮します.
                </p>`,
    invalidUrl: '有効なPixivのリンクを入力してください',
    failedDownload: 'イラストのダウンロードに失敗しました'
  }
};

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  currentLanguage = signal<Language>('en');
  availableLanguages: Language[] = ['en', 'ja'];

  constructor() {
    const savedLanguage = this.getFromStorage('language') as Language;
    if (savedLanguage && this.availableLanguages.includes(savedLanguage)) {
      this.currentLanguage.set(savedLanguage);
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null;
    } catch {
      return false;
    }
  }

  private getFromStorage(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  private setToStorage(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }

  setLanguage(lang: Language): void {
    if (this.availableLanguages.includes(lang)) {
      this.currentLanguage.set(lang);
      this.setToStorage('language', lang);
    }
  }

  getTranslation(key: string): string {
    return translations[this.currentLanguage()][key as keyof typeof translations['en']] || key;
  }

  cycleLanguage(): void {
    const currentIndex = this.availableLanguages.indexOf(this.currentLanguage());
    const nextIndex = (currentIndex + 1) % this.availableLanguages.length;
    this.setLanguage(this.availableLanguages[nextIndex]);
  }
}