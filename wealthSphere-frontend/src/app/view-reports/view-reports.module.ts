import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports/reports.component';
import { ViewReportsRoutingModule } from './view-reports-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ViewReportsRoutingModule,
    ReportsComponent
  ]
})
export class ViewReportsModule { }
