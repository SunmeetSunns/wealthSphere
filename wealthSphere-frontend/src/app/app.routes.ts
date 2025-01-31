import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ActionsComponent } from './actions/actions.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from './auth-guard.service';
export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'portfolio', component: PortfolioComponent ,canActivate: [AuthGuard] },
    { path: 'actions', component: ActionsComponent,canActivate: [AuthGuard]  },
    {path:'login',component:LoginComponent },
    {path:'sign-up',component:SignUpComponent},
    {path:'account-setup',component:AccountSettingsComponent,canActivate: [AuthGuard] },
    { 
      path: 'add-investment', 
      loadChildren: () => import('./add-investments/add-investments.module').then(m => m.AddInvestmentsModule) 
    },
    { 
      path: 'view-reports', 
      loadChildren: () => import('./view-reports/view-reports.module').then(m => m.ViewReportsModule) 
    },
];
