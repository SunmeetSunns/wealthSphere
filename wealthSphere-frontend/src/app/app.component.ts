import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HeaderComponent } from './header/header.component';
import { NewsComponent } from './news/news.component';
import { AddInvestmentsModule } from './add-investments/add-investments.module';
import { ActionsComponent } from './actions/actions.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerComponent } from "./spinner/spinner.component";
import { ViewReportsModule } from './view-reports/view-reports.module';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PortfolioComponent,
    HeaderComponent,
    NewsComponent,
    AddInvestmentsModule,
    ViewReportsModule,
    CommonModule,
    ActionsComponent,
    LoginComponent,
    SignUpComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isLoggedIn?: boolean;
  isSignupStage?: boolean;
  title = 'wealthSphere-frontend';
  showNews: boolean = true;
  showContent: boolean = true;

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Listen to route changes and hide components based on the active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide content for specific routes like 'add-investment' or 'view-reports'
        this.showContent = !(event.url.includes('add-investment') || event.url.includes('view-reports'));
      }
    });
  }

  // This method handles toggling the visibility of the news component
  onNewsToggle(isVisible: any) {
    this.showNews = isVisible;
  }

  onLogin(isVisible: any) {
    this.isLoggedIn = isVisible;

    // Manually trigger change detection after login status change
    this.cdr.detectChanges();
  }

  onSignup(isVisible: any) {
    this.isSignupStage = isVisible;

    // Manually trigger change detection after signup stage change
    this.cdr.detectChanges();
  }

  // This method toggles the visibility of the news panel
  toggleData() {
    this.showNews = !this.showNews;
  }
}
