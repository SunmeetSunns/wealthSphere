import { Routes } from '@angular/router';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { ActionsComponent } from './actions/actions.component';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'portfolio', component: PortfolioComponent },
    { path: 'actions', component: ActionsComponent },
    { 
      path: 'add-investment', 
      loadChildren: () => import('./add-investments/add-investments.module').then(m => m.AddInvestmentsModule) 
    },
    { 
      path: 'view-reports', 
      loadChildren: () => import('./view-reports/view-reports.module').then(m => m.ViewReportsModule) 
    },
];
