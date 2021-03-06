import { Injectable, ErrorHandler } from '@angular/core';
import * as Sentry from '@sentry/browser';
import { environment } from '../environments/environment';

Sentry.init({
  dsn: environment.sentryDsn
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    if (environment.production) {
      Sentry.captureException(error.originalError || error);
    } else {
      console.error(error.originalError || error);
    }
  }
}
