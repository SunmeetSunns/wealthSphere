import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StocksComponent } from './stocks/stocks.component';
import { CashComponent } from './cash/cash.component';
import { CryptoComponent } from './crypto/crypto.component';
import { FdComponent } from './fd/fd.component';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { FetchNewsComponent } from './fetch-news/fetch-news.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { AddFdComponent } from './add-fd/add-fd.component';
import { AddCashComponent } from './add-cash/add-cash.component';
import { AddCryptoComponent } from './add-crypto/add-crypto.component';
import { AuthGuard } from '../auth-guard.service';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'initialise',  // Redirect to 'stocks' if no sub-route is specified 
    pathMatch: 'full' 
  },
  {path:'initialise',component:AddInvestmentComponent,canActivate: [AuthGuard] },
  { path: 'stocks', component: StocksComponent ,canActivate: [AuthGuard] }, 
  { path: 'cash', component: CashComponent ,canActivate: [AuthGuard] }, 
  { path: 'crypto', component: CryptoComponent ,canActivate: [AuthGuard] },
  { path: 'fd', component: FdComponent,canActivate: [AuthGuard]  },
  {path:'fetch-news',component:FetchNewsComponent,canActivate: [AuthGuard] },
  {path:'add-stock',component:AddStockComponent,canActivate: [AuthGuard] },
  {path:'add-cash',component:AddCashComponent,canActivate: [AuthGuard] },
  {path:'add-fd',component:AddFdComponent,canActivate: [AuthGuard] },
  {path:'add-crypto',component:AddCryptoComponent,canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInvestmentsRoutingModule { }
