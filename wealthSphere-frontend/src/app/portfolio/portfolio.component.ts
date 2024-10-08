import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [ChartModule, CommonModule, TableModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  chartData: any;
  columns: any[] = [];
  data: any[] = [];
  assetsValue: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.populateSchema(); // Ensure columns are populated before fetching data
    this.getPortfolioData();
  }

  populateSchema() {
    this.columns = [
      { field: 'assets', header: 'Assets/Product' },
      { field: 'percentage', header: 'Percentage Allocation' },
      { field: 'assetValue', header: 'Total Quantity' }
    ];
  }

  getPortfolioData() {
    const url = 'http://localhost:3000/api/portfolio/portfolioTotal';
    this.http.get(url).subscribe((res: any) => {
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
            (stock || 0).toFixed(2),  // Use 0 if the data is undefined
            (cash || 0).toFixed(2),
            (crypto || 0).toFixed(2),
            (fd || 0).toFixed(2)
          ],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        }
      ]
    };
  }

  populateTableData(mydata: any) {
    const { stockTotal, cashTotal, cryptoTotal, fdTotal } = mydata?.assetValues || {};

    this.data = [
      { assets: 'Stocks', percentage: this.chartData.datasets[0].data[0], assetValue: stockTotal },
      { assets: 'Cash', percentage: this.chartData.datasets[0].data[1], assetValue: cashTotal },
      { assets: 'Crypto', percentage: this.chartData.datasets[0].data[2], assetValue: cryptoTotal },
      { assets: 'FD', percentage: this.chartData.datasets[0].data[3], assetValue: fdTotal }
    ];
  }
}
