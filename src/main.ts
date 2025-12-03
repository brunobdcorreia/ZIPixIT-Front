import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ZipixitApp } from './app/app';

bootstrapApplication(ZipixitApp, appConfig)
  .catch(err => console.error(err));