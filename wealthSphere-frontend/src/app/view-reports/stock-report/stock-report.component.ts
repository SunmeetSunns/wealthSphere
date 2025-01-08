import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stock-report',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './stock-report.component.html',
  styleUrl: './stock-report.component.css'
})
export class StockReportComponent implements OnInit {
  columns: any[] = [];
  data: any[] = [];

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.populateSchema()
    this.populateData()

  }

  populateSchema() {
    this.columns = [
      { field: 'stock', header: 'Stock Name' },
      { field: 'purchasePrice', header: 'Purchase Price' },
      { field: 'currentValue', header: 'Current Price' },
      { field: 'percentageChange', header: 'Percentage Change' },
      { field: 'riskLevel', header: 'Risk Level' }
    ]

  }
  populateData() {
    let url = 'http://localhost:3000/api/portfolio/stockRiskAssessment'
    this.http.get(url).subscribe((res) => {
      this.fillData(res)
    })
  }
  fillData(result: any) {
    result=result?.individualAssessments
    this.data = []
    for (let i = 0; i < result.length; i++) {
      this.data.push({
        stock: result[i].stock,
        currentValue:"₹ "+this.addCommasToNumber((result[i].currentValue).toFixed(2)),
        purchasePrice:"₹ "+ this.addCommasToNumber((result[i].purchasePrice).toFixed(2)),
        percentageChange: result[i].percentageChange,
        riskLevel: result[i].riskLevel
      })
    }
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}