import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const token = localStorage.getItem('authToken');

  // Check if the API is a webhook
  const isWebhook = req.url.includes('/webhook'); // Adjust the identifier accordingly

  if (!isWebhook) {
    loaderService.show(); // Show spinner only for non-webhook requests
  }

  const modifiedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  return next(modifiedReq).pipe(
    finalize(() => {
      if (!isWebhook) {
        loaderService.hideWithMinimumDelay(); // Hide spinner only if it was shown
      }
    })
  );
};
