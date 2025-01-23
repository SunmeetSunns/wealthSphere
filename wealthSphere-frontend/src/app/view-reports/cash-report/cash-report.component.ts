import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cash-report',
  standalone: true,
  imports: [CommonModule,TableModule],
  templateUrl: './cash-report.component.html',
  styleUrl: './cash-report.component.css'
})
export class CashReportComponent {
   private apiUrl = environment.apiUrl;

  columns: any[] = [];
  data: any[] = [];

  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.populateSchema();
    this.populateData()
  }
  populateSchema() {
    this.columns = [
      { field: 'currency', header: 'Currency' },
      // { field: 'stock', header: 'Stock Name' },
      // { field: 'quantity', header: 'Quantity' },
      { field: 'totalAmount', header: 'Total Amount' },
      { field: 'totalAmountinINR', header: 'Total Amount in INR' },
    ]
  }
  populateData() {
    let url = `${this.apiUrl}/api/portfolio/getCashReport`
    this.http.get(url).subscribe((res) => {
      this.fillData(res)
    })
  }
  fillData(result: any) {
    result=result?.currencySummary
    this.data = [];
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        svg:result[i].svg,
        currency: result[i].currency,
        totalAmount:result[i]?.symbol + ' '+ this.addCommasToNumber((result[i].totalAmount).toFixed(2)),
        totalAmountinINR:"₹ "+this.addCommasToNumber((result[i].totalAmountInINR).toFixed(2)),
      });
    }
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

