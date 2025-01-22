import { FetchNewsComponent } from '../fetch-news/fetch-news.component';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-cash',
  standalone: true,
  imports: [FetchNewsComponent,CommonModule,TableModule],
  templateUrl: './cash.component.html',
  styleUrl: './cash.component.css'
})
export class CashComponent implements OnInit {
  columns: any[] = [];
  data: any[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.populateSchema();
    this.getCashData();
  }

  // Define columns for the Cash table
  populateSchema() {
    this.columns = [
      { field: 'source', header: 'Source' },
      { field: 'amount', header: 'Amount' },
      { field: 'currency', header: 'Currency' },
      {field:'inrAmount',header:'Estimated Amt.'},
      { field: 'date', header: 'Date' },
      {field:'actions',header:''}
    ];
  }
storeToEdit(rowData:any){
sessionStorage.setItem('Data_for_Edit',JSON.stringify(rowData));
this.router.navigate(['/add-investment/add-cash'])
}
  // Fetch cash data from backend API
  getCashData() {
    const url = 'https://wealtsphere.onrender.com/api/portfolio/getcash';
    this.http.get(url).subscribe((res) => {
      if (res) {
        this.populateData(res);
      }
    });
  }

  // Map data to table structure
  populateData(result: any) {
    this.data = [];
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        source: result[i].source,
        amount: this.addCommasToNumber(result[i].amount.toFixed(2)),
        currency: result[i].currency,
        svg_url:result[i].svg_url,
        symbol:result[i].symbol,
        inrAmount:this.addCommasToNumber((result[i].amountinINR).toFixed(2)),
        orderId:result[i].orderId,
        date: new Date(result[i].date).toLocaleDateString(),
      });
    }
  }

  // Redirect to cash addition form
  routeToCash() {
    this.router.navigate(['/add-investment/add-cash']);
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
