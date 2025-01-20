import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrected 'styleUrl' to 'styleUrls'
})
export class LoginComponent implements OnInit {
  @Output() toggleLoginComponent = new EventEmitter<boolean>();
  @Output() toggleSignupComponent = new EventEmitter<boolean>();
  isLoggedIn?: boolean;
  isSignupStage?: boolean = false;
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { } // Added FormBuilder injection in the constructor

  ngOnInit(): void {
    if (localStorage.getItem('authToken')) {
      this.isLoggedIn = true;
      this.toggleLoginComponent.emit(this.isLoggedIn);
    }

    this.buildForm();


  }

  changeState() {
    let url = 'http://localhost:3000/api/user/login'
    let body = {
      username: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    }
    this.http.post(url, body, { withCredentials: true }).subscribe((res) => {
      if (res) {
        let token = this.setToken(res)
        if (token) {
          this.isLoggedIn = !this.isLoggedIn;
          this.toggleLoginComponent.emit(this.isLoggedIn);
        }

      }
    })
  }
  setToken(res: any) {
    localStorage.setItem('authToken', res?.token)
    let token = localStorage.getItem('authToken')
    return token;
  }
  buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required], // Example field
      password: ['', Validators.required]  // Example field
    });
  }
  routeToSignUp() {
    this.isSignupStage = !this.isSignupStage;
    this.toggleSignupComponent.emit(this.isSignupStage)
    // this.router.navigate([`/sign-up`])
  }
}
