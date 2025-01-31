import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  userPresent?: boolean;

  constructor(private router: Router) { }

  canActivate(): boolean {
    const user = localStorage.getItem('userData')
    if (user) {
      this.userPresent = true;
    }
    const isLoggedIn = this.userPresent;
    const localExpiry = localStorage.getItem('tokenExpiry');
    const currentTime = new Date().getTime();

    // Check if the local is expired
    if (isLoggedIn) {
      return true; // local is still valid
    } else {
      // If local is expired or not logged in, redirect to login page
      // localStorage.removeItem('userData');
      // localStorage.removeItem('localExpiry');
      this.router.navigate(['/']);
      return false; // Deny access
    }
  }
}
