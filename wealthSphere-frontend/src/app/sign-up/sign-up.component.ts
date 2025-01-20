import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators ,ReactiveFormsModule, FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit {

 @Output() toggleSignupComponent = new EventEmitter<boolean>();
 @Output() toggleLoginComponent = new EventEmitter<boolean>();
 isSignupStage: boolean = false;
  signupForm!: FormGroup;
  isLoggedIn!: boolean;

  constructor(private formBuilder: FormBuilder,private router:Router
    ,
    private http:HttpClient
  ) {} // Added FormBuilder injection in the constructor

  ngOnInit(): void {
    this.buildForm();
  }

  changeState() {
    this.isSignupStage = false;
    this.toggleSignupComponent.emit(this.isSignupStage);
  }
  loginState() {
    this.signupForm.markAllAsTouched();
    if(this.signupForm.invalid)
      return;
    let url='http://localhost:3000/api/user/signUp'
    let body={
      first_name:this.signupForm.get('first_name')?.value,
      last_name:this.signupForm.get('last_name')?.value,
      mobile_no:this.signupForm.get('mobile_number')?.value,
      username:this.signupForm.get('username')?.value,
      password:this.signupForm.get('password')?.value
    }
    this.http.post(url,body).subscribe((res)=>{
      console.log(res)
    })
    this.isLoggedIn = !this.isLoggedIn;
    this.toggleLoginComponent.emit(this.isLoggedIn);
  }

  buildForm() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required], 
      password: ['', Validators.required],
      confirm_password:['',Validators.required],
      first_name:['',Validators.required],
      last_name:['',Validators.required],
      mobile_number:['',Validators.required]

    });
  }
}
