import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ActionsComponent } from './actions/actions.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'actions', component: ActionsComponent },
    {path:'login',component:LoginComponent},
    {path:'sign-up',component:SignUpComponent},
    { 
      path: 'add-investment', 
      loadChildren: () => import('./add-investments/add-investments.module').then(m => m.AddInvestmentsModule) 
    },
    { 
      path: 'view-reports', 
      loadChildren: () => import('./view-reports/view-reports.module').then(m => m.ViewReportsModule) 
    },
];
