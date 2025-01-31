import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FetchNewsComponent } from '../fetch-news/fetch-news.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [FetchNewsComponent, TableModule, CommonModule],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.css'
})
export class CryptoComponent {
  private apiUrl = environment.apiUrl;

  columns: any[] = [];
  data: any[] = [];
  userData: any;
  constructor(private http: HttpClient, public router: Router) { }
  ngOnInit() {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
    this.populateSchema();
    this.getStockData();
    // this.getNewsData();
  }

  populateSchema() {
    this.columns = [
      { field: 'type', header: 'Type' },
      { field: 'quantity', header: 'Quantity Owned' },
      { field: 'purchasePrice', header: 'Purchase Price' },
      { field: 'currentValue', header: 'Current Value' },
      { field: 'totalValue', header: 'Total Value' },
      { field: 'purchaseDate', header: 'Purchase Date' },
      { field: 'action', hseader: ' ' },
    ];
  }
  getStockData() {
    let body = {
      username: this.userData?.username
    }
    let url = `${this.apiUrl}/api/portfolio/getcrypto`
    this.http.post(url, body).subscribe((res) => {
      if (res) {
        this.populateData(res)
      }
    })
  }
  populateData(result: any) {
    this.data = []; // Clear the data array
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        type: result[i].type,
        quantity: result[i].quantity,
        totalValue: this.addCommasToNumber(result[i].totalValue.toFixed(2)),
        purchasePrice: this.addCommasToNumber(result[i].purchasePrice.toFixed(2)),
        currentValue: this.addCommasToNumber(result[i].currentValue.toFixed(2)),
        orderId: result[i].orderId ? result[i].orderId : '',
        purchaseDate: this.formatDate(result[i].purchaseDate),
      });
    }
  }

  routeToStock() {
    this.router.navigate(['/add-investment/add-crypto'])
  }
  storeToEdit(rowData: any) {
    // Convert the rowData object to a JSON string
    sessionStorage.setItem('Data_for_Edit', JSON.stringify(rowData));

    // Navigate to the add-stock route
    this.router.navigate(['/add-investment/add-crypto']);
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  formatDate(dateString: string): string {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are zero-indexed
    const year = date.getFullYear();

    // Return the formatted date as "DD-MM-YYYY"
    return `${day}-${month}-${year}`;
  }
}

