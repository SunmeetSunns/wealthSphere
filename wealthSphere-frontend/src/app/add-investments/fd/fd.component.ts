import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { FetchNewsComponent } from '../fetch-news/fetch-news.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fd',
  standalone: true,
  imports: [CommonModule, TableModule, FetchNewsComponent],
  templateUrl: './fd.component.html',
  styleUrl: './fd.component.css'
})
export class FdComponent {
  private apiUrl = environment.apiUrl;
  columns: any[] = [];
  data: any[] = [];
  userData: any;
  constructor(private http: HttpClient, public router: Router) { }
  ngOnInit() {
    const user = localStorage.getItem('userData')
    if (user) {
      this.userData = JSON.parse(user)
      this.populateSchema();
      this.getStockData();
    }
    if (!user) {
      this.homeScreen();
    }
  }
  homeScreen() {
    this.router.navigate(['/'])
  }

  populateSchema() {
    this.columns = [
      { field: 'bank', header: 'Bank' },
      { field: 'amount', header: 'Deposit Amount' },
      { field: 'interest_rate', header: 'Interest Rate' },
      { field: 'tenure', header: 'Tenure' },
      { field: 'maturity_date', header: 'Maturity Date' },
      { field: 'expected_return', header: 'Maturity Amount' },
      { field: 'action', hseader: ' ' },
    ];
  }
  getStockData() {
    let url = `${this.apiUrl}/api/portfolio/getfd`;
    let body = {
      username: this.userData?.username
    }
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
        bank: result[i].bankName,
        amount: this.addCommasToNumber(result[i]?.depositAmount.toFixed(2)),
        interest_rate: result[i].interestRate,
        tenure: result[i].tenure,
        maturity_date: new Date(result[i].maturityDate).toLocaleDateString(),
        expected_return: this.addCommasToNumber(result[i]?.expectedReturn.toFixed(2)),
        orderId: result[i].orderId ? result[i].orderId : '',
      });
    }
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  routeToStock() {
    this.router.navigate(['/add-investment/add-fd'])
  }
  storeToEdit(rowData: any) {
    // Convert the rowData object to a JSON string
    sessionStorage.setItem('Data_for_Edit', JSON.stringify(rowData));

    // Navigate to the add-stock route
    this.router.navigate(['/add-investment/add-fd']);
  }

}

