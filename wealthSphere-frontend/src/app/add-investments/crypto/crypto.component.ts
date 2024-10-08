import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FetchNewsComponent } from '../fetch-news/fetch-news.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crypto',
  standalone: true,
  imports: [FetchNewsComponent,TableModule,CommonModule],
  templateUrl: './crypto.component.html',
  styleUrl: './crypto.component.css'
})
export class CryptoComponent {

  columns: any[] = [];
  data: any[] = [];
  constructor(private http: HttpClient,public router:Router) { }
  ngOnInit() {
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
      {field:'purchaseDate',header:'Purchase Date'},
      { field: 'action', hseader: ' ' },
    ];
  }
  getStockData() {
    let url = 'http://localhost:3000/api/portfolio/getcrypto'
    this.http.get(url).subscribe((res) => {
      if (res) {
        console.log(res)
        this.populateData(res)
      }
    })
  }
  populateData(result: any) {
    this.data = []; // Clear the data array
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        type:result[i].type,
        quantity: result[i].quantity,
        totalValue: result[i].totalValue,
        purchasePrice: result[i].purchasePrice,
        currentValue:result[i].currentValue,
        orderId:result[i].orderId ? result[i].orderId:'',
        purchaseDate:result[i].purchaseDate,
      });
    }
  }

routeToStock(){
  this.router.navigate(['/add-investment/add-crypto'])
}
storeToEdit(rowData: any) {
  // Convert the rowData object to a JSON string
  sessionStorage.setItem('Data_for_Edit', JSON.stringify(rowData));
  
  // Navigate to the add-stock route
  this.router.navigate(['/add-investment/add-crypto']);
}

}

