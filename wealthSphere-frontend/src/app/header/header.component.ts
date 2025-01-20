import { Component, Output, EventEmitter ,HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() toggleLoginComponent = new EventEmitter<boolean>();
  @Output() toggleSignupComponent = new EventEmitter<boolean>();
  isLoggedIn?: boolean;
  isSignupStage?: boolean;
  email: String = 'abc@gmail.com';
  showDiv: boolean = false;;
  changeState() {
    if (localStorage.getItem('authToken')) {
      localStorage.removeItem('authToken')
    }
    this.isLoggedIn = false;
    this.isSignupStage = false;

    this.toggleLoginComponent.emit(this.isLoggedIn)
    this.toggleSignupComponent.emit(this.isSignupStage)

  }
  toggleDiv() {
    this.showDiv = !this.showDiv;
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
