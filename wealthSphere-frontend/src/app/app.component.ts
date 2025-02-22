import { Component, ChangeDetectorRef, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatbotComponent } from './chatbot/chatbot.component';

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
    SignUpComponent,
    SpinnerComponent,
    ChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('noAccModal') noAccModal!: TemplateRef<any>;
  isLoggedIn?: boolean;
  isSignupStage?: boolean;
  title = 'wealthSphere-frontend';
  showNews: boolean = true;
  showContent: boolean = true;
  isChatboxOpen: any=false;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private modal: NgbModal
  ) {
    // Listen to route changes and hide components based on the active route
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const restrictedRoutes = ['add-investment', 'view-reports', 'account-setup'];
        this.showContent = !restrictedRoutes.some((route) => event.url.includes(route));
        this.cdr.detectChanges(); // Trigger change detection
      }
    });
  }

  ngOnInit(): void {}

  // ngAfterViewInit(): void {
  //   if (sessionStorage.getItem('newUser')) {
  //     this.openNewUserModal(this.noAccModal);
  //   }
  // }

  // openNewUserModal(modal: any): void {
  //   this.modal.open(modal, { size: 'md', centered: true });
  // }

  close(): void {
    this.modal.dismissAll();
  }

  onNewsToggle(isVisible: boolean): void {
    this.showNews = isVisible;
  }

  onLogin(isVisible: boolean): void {
    this.isLoggedIn = isVisible;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  onSignup(isVisible: boolean): void {
    this.isSignupStage = isVisible;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  toggleData(): void {
    this.showNews = !this.showNews;
  }
  openChatBot(){
    this.isChatboxOpen=!this.isChatboxOpen;
  }
  routeToSetup(): void {
    this.modal.dismissAll(); // Close modal
    this.router.navigate(['account-setup']).then(() => {

    });
  }

  ngOnDestroy(): void {
    this.modal.dismissAll(); // Ensure modals are closed when component is destroyed
  }
}
