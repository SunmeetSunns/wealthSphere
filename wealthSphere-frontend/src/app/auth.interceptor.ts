import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the LoaderService
  const loaderService = inject(LoaderService);

  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken');

  // Show the loading spinner
  loaderService.show();

  // Clone the request and add the Authorization header if token exists
  const modifiedReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    : req;

  // Handle the request and hide the spinner when complete
  return next(modifiedReq).pipe(
    finalize(() => {
      // Hide the loading spinner
      loaderService.hideWithMinimumDelay();
    })
  );
};
