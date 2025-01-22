import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crypto-report',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './crypto-report.component.html',
  styleUrl: './crypto-report.component.css'
})
export class CryptoReportComponent implements OnInit {
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
      { field: 'type', header: 'Type' },
      // { field: 'stock', header: 'Stock Name' },
      // { field: 'quantity', header: 'Quantity' },
      { field: 'currentValue', header: 'Current Price' },
      { field: 'purchasePrice', header: 'Purchase Price' },
      { field: 'percentageChange', header: 'Percentage Change' },
      { field: 'riskLevel', header: 'Risk Level' }
    ]
  }
  populateData() {
    let url = 'https://wealtsphere.onrender.com/api/portfolio/cryptoRiskAssessment'
    this.http.get(url).subscribe((res) => {
      this.fillData(res)
    })
  }
  fillData(result: any) {
    result=result?.individualAssessments
    this.data = [];
    for (let i = 0; i < result?.length; i++) {
      this.data.push({
        type: result[i].type,
        currentValue: "₹ "+this.addCommasToNumber((result[i].currentValue).toFixed(2)),
        purchasePrice:"₹ "+this.addCommasToNumber((result[i].purchasePrice).toFixed(2)),
        percentageChange:result[i].percentageChange,
        riskLevel:result[i].riskLevel,
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
