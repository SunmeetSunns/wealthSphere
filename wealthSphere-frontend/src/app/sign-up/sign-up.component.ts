import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule, MaxLengthValidator } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,ChatbotComponent],
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
  lengthError?: boolean;
  passText: string='';
  errorMsg:string='';
  isChatboxOpen: boolean=false;

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
        if(!res?.success){
          this.setErrorMsg(res);
          return;
        }
        else{
          this.setToken(res);
          this.isLoggedIn = !this.isLoggedIn;
          this.toggleLoginComponent.emit(this.isLoggedIn);
        }
      
      }
    });
  }

  setErrorMsg(res:any){
if(!res?.success){
  this.errorMsg=res?.message
}
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
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]], 
      password: ['', [Validators.required,  Validators.minLength(8)]], 
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      mobile_number: ['', [Validators.required,Validators.maxLength(10), Validators.minLength(10)]]
    });
  }
  openChatBot(){
    this.isChatboxOpen=!this.isChatboxOpen;
  }
  checkMail(){
    
  }
  confirmPass(){
   const pass= this.signupForm.get('password')?.value
   const confrm_pass=this.signupForm.get('confirm_password')?.value;
   if(confrm_pass !==pass){
    this.passText=`Password doesn't match`;
   }
   else{
    this.passText=''
   }
  }
  checkPass() {
    const pass = this.signupForm.get('password')?.value || ''; // Ensure pass is always a string
    this.lengthError = pass.length < 8;
  }
  
}
