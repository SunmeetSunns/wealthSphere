import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ChartModule, CommonModule, TableModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  chartData: any;
  columns: any[] = [];
  data: any[] = [];
  assetsValue: any;
  userData: any;
  isNewUser?: boolean;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
    const userNew = sessionStorage.getItem('newUser')
    if (userNew) {
      this.isNewUser = true;
    }
    else {
      this.populateSchema(); // Ensure columns are populated before fetching data
      this.getPortfolioData();
    }

  }

  populateSchema() {
    this.columns = [
      { field: 'assets', header: 'Assets/Product' },
      { field: 'percentage', header: 'Percentage Allocation' },
      { field: 'assetValue', header: 'Total Quantity' }
    ];
  }

  getPortfolioData() {
    let body = {
      username: this.userData?.username
    }
    const url = `${this.apiUrl}/api/portfolio/portfolioTotal`;
    this.http.post(url, body).subscribe((res: any) => {
      if (res) {
        this.populateData(res);
        this.populateTableData(res);
      }
    });
  }

  populateData(mydata: any) {
    // Assuming mydata.percentages contains the percentages
    const { cash, crypto, fd, stock } = mydata?.percentages || {};

    // Prepare chart data using the provided percentages
    this.chartData = {
      labels: ['Stocks', 'Cash', 'Crypto', 'FD'],
      datasets: [
        {
          data: [
            (stock || 0), // Use 0 if the data is undefined
            (cash || 0),
            (crypto || 0),
            (fd || 0)
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }
      ]
    };
  }

  populateTableData(mydata: any) {
    if(mydata?.newUser){
      sessionStorage.setItem('newUser',mydata?.newUser);
      this.isNewUser=true;
      
    }
    else{
      sessionStorage.removeItem('newUser');
      this.isNewUser=false;
      const { stockTotal, cashTotal, cryptoTotal, fdTotal } = mydata?.assetValues || {};

      this.data = [
        { assets: 'Stocks', percentage: this.chartData.datasets[0].data[0] + ' %', assetValue: (stockTotal).toFixed(2) },
        { assets: 'Cash', percentage: this.chartData.datasets[0].data[1] + ' %', assetValue: (cashTotal).toFixed(2) },
        { assets: 'Crypto', percentage: this.chartData.datasets[0].data[2] + ' %', assetValue: (cryptoTotal).toFixed(2) },
        { assets: 'FD', percentage: this.chartData.datasets[0].data[3] + ' %', assetValue: (fdTotal).toFixed(2) }
      ];
    }
   
  }
  routeToSetup(): void {
    this.router.navigate(['account-setup']).then(() => {
    
    });
  }

}
