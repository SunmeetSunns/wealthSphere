import { Component, Output, EventEmitter ,HostListener, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  @Output() toggleLoginComponent = new EventEmitter<boolean>();
  @Output() toggleSignupComponent = new EventEmitter<boolean>();
  isLoggedIn?: boolean;
  isSignupStage?: boolean;
  email: String = 'abc@gmail.com';
  showDiv: boolean = false;
  userData: any;
  constructor(private router:Router){
    
  }
  ngOnInit(): void {
    if(localStorage.getItem('userData')){
      const user=localStorage.getItem('userData');
      if(user){
        this.userData=JSON.parse(user)
      }
      this.email=this.userData?.username
    }
  }
  homeScreen(){
    this.router.navigate(['/'])
  }
  changeState() {
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken')
    }
    if(localStorage.getItem('userData')){
      sessionStorage.removeItem('userData')
    }
    if(sessionStorage.getItem('newUser')){
      sessionStorage.removeItem('newUser')
    }
    if(localStorage.getItem('tokenExpiry')){
      localStorage.removeItem('tokenExpiry')
    }
    this.isLoggedIn = false;
    this.isSignupStage = false;

    this.toggleLoginComponent.emit(this.isLoggedIn)
    this.toggleSignupComponent.emit(this.isSignupStage)

  }
  toggleDiv() {
    this.showDiv = !this.showDiv;
  }
  myProfile(){
    this.router.navigate([`/account-setup`])
    this.showDiv=false;
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    // Check if the click is outside the div
    const profileElement = document.querySelector('.profile');
    const divElement = document.querySelector('.cardBoxShadowBox');

    if (profileElement && !profileElement.contains(event.target as Node) && divElement && !divElement.contains(event.target as Node)) {
      this.showDiv = false;  // Close the div
    }
  }
}
