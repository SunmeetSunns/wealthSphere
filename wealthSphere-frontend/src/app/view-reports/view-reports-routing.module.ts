import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports/reports.component';
import { CryptoReportComponent } from './crypto-report/crypto-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { CashReportComponent } from './cash-report/cash-report.component';
import { FdReportComponent } from './fd-report/fd-report.component';

const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'reports',  
    pathMatch: 'full' 
  },
  {path:'reports',component:ReportsComponent},
  {path:'crypto-report',component:CryptoReportComponent},
  {path:'stock-report',component:StockReportComponent},
  {path:'cash-report',component:CashReportComponent},
  {path:'fd-report',component:FdReportComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewReportsRoutingModule { }

// jb bhi hole yaad rkhio navigation ka issue tha reports m 
