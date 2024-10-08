import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdComponent } from './fd/fd.component';
import { AddInvestmentsRoutingModule } from './add-investments-routing.module';
import { StocksComponent } from './stocks/stocks.component';
import { CashComponent } from './cash/cash.component';
import { CryptoComponent } from './crypto/crypto.component';
import { AddInvestmentComponent } from './add-investment/add-investment.component';
import { FetchNewsComponent } from './fetch-news/fetch-news.component';
import { AddStockComponent } from './add-stock/add-stock.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AddInvestmentsRoutingModule,
    FdComponent,
    StocksComponent,
    CashComponent,
    CryptoComponent,
    AddInvestmentComponent,
    FetchNewsComponent,
    AddStockComponent,
    ReactiveFormsModule
  ]
})
export class AddInvestmentsModule { }
