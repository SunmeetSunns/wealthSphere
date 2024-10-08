import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { HeaderComponent } from './header/header.component';
import { NewsComponent } from './news/news.component';
import { AddInvestmentsModule } from './add-investments/add-investments.module';
import { ActionsComponent } from './actions/actions.component';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { SpinnerComponent } from "./spinner/spinner.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PortfolioComponent,
    HeaderComponent,
    NewsComponent,
    AddInvestmentsModule,
    CommonModule,
    ActionsComponent,
    SpinnerComponent
],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fixed the typo here
})
export class AppComponent {

  constructor(private router: Router) {
    // Listen to route changes and hide components based on the active route
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Hide content when navigating to 'special-route'
        this.showContent = !event.url.includes('add-investment');
      }
    });
  }
  title = 'wealthSphere-frontend';
  showNews: boolean = true;
  showContent: boolean = true;
  // This method handles toggling the visibility of the news component
  onNewsToggle(isVisible: any) {
    this.showNews = isVisible;
    console.log(this.showNews)
  }
  toggleData() {
    this.showNews = !this.showNews
  }
}