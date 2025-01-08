import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FetchNewsComponent } from '../fetch-news/fetch-news.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stocks',
  standalone: true,
  imports: [CommonModule, TableModule, FetchNewsComponent],
  templateUrl: './stocks.component.html',
  styleUrl: './stocks.component.css'
})
export class StocksComponent {
  columns: any[] = [];
  data: any[] = [];
  constructor(private http: HttpClient, public router: Router) { }
  ngOnInit() {
    this.populateSchema();
    this.getStockData();
    // this.getNewsData();
  }

  populateSchema() {
    this.columns = [
      { field: 'company', header: 'Stocks' },
      { field: 'symbol', header: 'Stock Symbol' },
      { field: 'quantity', header: 'Quantity Owned' },
      { field: 'purchasePrice', header: 'Purchase Price' },
      { field: 'totalValue', header: 'Total Value' },
      { field: 'action', hseader: ' ' },
    ];
  }
  getStockData() {
    let url = 'http://localhost:3000/api/portfolio/getstock'
    this.http.get(url).subscribe((res) => {
      if (res) {
        this.populateData(res)
      }
    })
  }
  populateData(result: any) {
    this.data = []; // Clear the data array
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        company: result[i].company,
        symbol: result[i].symbol,
        quantity: result[i].quantity,
        totalValue: this.addCommasToNumber(result[i].totalValue.toFixed(2)),
        purchasePrice: this.addCommasToNumber(result[i].purchasePrice.toFixed(2)),
        currentPrice: this.addCommasToNumber(result[i].currentPrice.toFixed(2)),
        orderId: result[i].orderId ? result[i].orderId : '',
      });
    }
  }

  routeToStock() {
    this.router.navigate(['/add-investment/add-stock'])
  }
  storeToEdit(rowData: any) {
    // Convert the rowData object to a JSON string
    sessionStorage.setItem('Data_for_Edit', JSON.stringify(rowData));

    // Navigate to the add-stock route
    this.router.navigate(['/add-investment/add-stock']);
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

}
