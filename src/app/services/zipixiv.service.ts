import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

enum UrlValidationResult {
  VALID,
  EMPTY,
  INVALID_FORMAT,
}

interface ValidationResponse {
  isValid: boolean;
  message: string;
}

export interface DownloadResponse {
  blob: Blob;
  filename: string;
}

function getValidationResponse(result: UrlValidationResult): ValidationResponse {
  let response: ValidationResponse;

  switch (result) {
    case UrlValidationResult.VALID:
      response = { isValid: true, message: 'URL is valid.' };
      break;

    case UrlValidationResult.EMPTY:
      response = { isValid: false, message: 'No URL was supplied.' };
      break;

    case UrlValidationResult.INVALID_FORMAT:
      response = { isValid: false, message: 'Invalid URL format.' };
      break;
      
    default:
      response = { isValid: false, message: 'An unknown validation error occurred.' };
  }

  return response;
}

@Injectable({
  providedIn: 'root'
})
export class ZipixivService {
  validateIllustrationUrl(url: string): ValidationResponse {
    const pixivRegex = /pixiv\.net\/(en\/)?artworks\/\d+/;

    if (!url || url.trim() === '') {
      return getValidationResponse(UrlValidationResult.EMPTY);
    } 
    
    try {
      new URL(url); 
      if (pixivRegex.test(url)) {
        return getValidationResponse(UrlValidationResult.VALID);
      } else {
        return getValidationResponse(UrlValidationResult.INVALID_FORMAT); 
      }
    } catch (e) {
      if (e instanceof TypeError) {
        return getValidationResponse(UrlValidationResult.INVALID_FORMAT);
      }
      return getValidationResponse(UrlValidationResult.INVALID_FORMAT); 
    }
  }

  private apiUrl = '/api/download';

  constructor(private http: HttpClient) { }

  downloadIllustrations(illustUrl: string, compressionFormat: string, illustRange?: string): Observable<DownloadResponse> {
    const payload = {
      illust_url: illustUrl,
      illust_range: illustRange,
      compressionFormat: compressionFormat || ''
    };

    return this.http.post(
      this.apiUrl, 
      payload, 
      { responseType: 'blob', observe: 'response' }
    ).pipe(
      map((response: HttpResponse<Blob>) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'illust.zip';

        if (contentDisposition) {
          const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/);
          if (filenameStarMatch && filenameStarMatch[1]) {
            filename = decodeURIComponent(filenameStarMatch[1]);
          } else {
            const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
            if (filenameMatch && filenameMatch[1]) {
              filename = filenameMatch[1];
            }
          }
        }

        return {
          blob: response.body!,
          filename: filename
        };
      })
    );
  }
}