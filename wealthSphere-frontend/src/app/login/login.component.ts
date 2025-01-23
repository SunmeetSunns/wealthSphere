import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'], // Corrected 'styleUrl' to 'styleUrls'
})
export class LoginComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  @Output() toggleLoginComponent = new EventEmitter<boolean>();
  @Output() toggleSignupComponent = new EventEmitter<boolean>();
  isLoggedIn?: boolean;
  isSignupStage?: boolean = false;
  loginForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Check token validity
    const token = this.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.toggleLoginComponent.emit(this.isLoggedIn);
    } else {
      this.isLoggedIn = false;
    }

    this.buildForm();
  }

  changeState(): void {
    const url = `${this.apiUrl}/api/user/login`;
    const body = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value,
    };

    this.http.post(url, body, { withCredentials: true }).subscribe((res: any) => {
      if (res) {
        const token = this.setToken(res);
        if (token) {
          this.isLoggedIn = !this.isLoggedIn;
          this.toggleLoginComponent.emit(this.isLoggedIn);
        }
      }
    });
  }

  setToken(res: any): string | null {
    if (this.isLocalStorageAvailable()) {
      const expiryTime = new Date().getTime() + res.expiresIn * 1000; // Assuming `expiresIn` is in seconds
      localStorage.setItem('authToken', res.token);
      localStorage.setItem('tokenExpiry', expiryTime.toString());
      sessionStorage.setItem('userData', JSON.stringify(res.user));
      return res.token;
    }
    return null;
  }

  getToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      const expiryTime = localStorage.getItem('tokenExpiry');
      if (expiryTime && parseInt(expiryTime, 10) > new Date().getTime()) {
        return localStorage.getItem('authToken');
      } else {
        this.clearToken(); // Clear expired token
      }
    }
    return null;
  }

  clearToken(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenExpiry');
      sessionStorage.removeItem('userData');
    }
  }

  buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  routeToSignUp(): void {
    this.isSignupStage = !this.isSignupStage;
    this.toggleSignupComponent.emit(this.isSignupStage);
    // this.router.navigate([`/sign-up`]);
  }

  // Helper method to check if localStorage is available
  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined';
    } catch {
      return false;
    }
  }
}
