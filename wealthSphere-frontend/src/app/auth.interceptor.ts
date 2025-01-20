import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('authToken');


  // Clone the request and add the Authorization header if token exists
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  // If no token, continue the request without modifying
  return next(req);
};
