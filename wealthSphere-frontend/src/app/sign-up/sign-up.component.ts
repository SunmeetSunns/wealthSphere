import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

  @Output() toggleSignupComponent = new EventEmitter<boolean>();
  @Output() toggleLoginComponent = new EventEmitter<boolean>();
  isSignupStage: boolean = false;
  signupForm!: FormGroup;
  isLoggedIn!: boolean;
  apiUrl = environment.apiUrl;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  changeState() {
    this.isSignupStage = false;
    this.toggleSignupComponent.emit(this.isSignupStage);
  }

  loginState() {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid)
      return;

    const url = `${this.apiUrl}/api/user/signUp`;
    const body = {
      first_name: this.signupForm.get('first_name')?.value,
      last_name: this.signupForm.get('last_name')?.value,
      mobile_no: this.signupForm.get('mobile_number')?.value,
      username: this.signupForm.get('username')?.value,
      password: this.signupForm.get('password')?.value
    };

    this.http.post(url, body).subscribe((res: any) => {
      if (res) {
        this.setToken(res);
        this.isLoggedIn = !this.isLoggedIn;
        this.toggleLoginComponent.emit(this.isLoggedIn);
      }
    });
  }

  setToken(res: any): string | null {
    // Assuming the server sends an expiresIn (expiry time in seconds)
    const expiryTime = new Date().getTime() + res.expiresIn * 1000; // expiry in milliseconds
    localStorage.setItem('authToken', res?.token);
    localStorage.setItem('userData', JSON.stringify(res?.user));
    localStorage.setItem('tokenExpiry', expiryTime.toString()); // Store token expiry time
    sessionStorage.setItem('newUser', res?.newUser);

    return res?.token;
  }

  buildForm() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      mobile_number: ['', Validators.required]
    });
  }
}
