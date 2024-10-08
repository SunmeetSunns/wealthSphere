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

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'initialise',  // Redirect to 'stocks' if no sub-route is specified 
    pathMatch: 'full' 
  },
  {path:'initialise',component:AddInvestmentComponent},
  { path: 'stocks', component: StocksComponent }, 
  { path: 'cash', component: CashComponent }, 
  { path: 'crypto', component: CryptoComponent },
  { path: 'fd', component: FdComponent },
  {path:'fetch-news',component:FetchNewsComponent},
  {path:'add-stock',component:AddStockComponent},
  {path:'add-cash',component:AddCashComponent},
  {path:'add-fd',component:AddFdComponent},
  {path:'add-crypto',component:AddCryptoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddInvestmentsRoutingModule { }
