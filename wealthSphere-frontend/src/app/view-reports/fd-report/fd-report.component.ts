import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-fd-report',
  standalone: true,
  imports: [CommonModule,TableModule],
  templateUrl: './fd-report.component.html',
  styleUrl: './fd-report.component.css'
})
export class FdReportComponent {
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
      { field: 'bank', header: 'Bank' },
      // { field: 'stock', header: 'Stock Name' },
      // { field: 'quantity', header: 'Quantity' },
      { field: 'maturityMonth', header: 'Maturity Month' },
      { field: 'noOfFDs', header: 'No. of FDs' },
      { field: 'totalDepositAmount', header: 'Total Deposit Amount' },
      { field: 'totalMaturityAmount', header: 'Total Maturity Amount' },
    ]
  }
  populateData() {
    let url = `${this.apiUrl}/api/portfolio/getfdReport`
    this.http.get(url).subscribe((res) => {
      this.fillData(res)
    })
  }
  fillData(result: any) {
    result=result?.data
    console.log(result)
    this.data = [];
    for (let i = 0; i < result?.length; i++) {
      for(let j=0;j<result[i]?.maturityDetails?.length;j++){
        console.log(result[i]?.maturityDetails)
        this.data.push(
          {
            bank:result[i].bankName,
            maturityMonth:result[i]?.maturityDetails[j]?.maturityMonth,
            noOfFDs:result[i]?.maturityDetails[j]?.numberOfFDs,
            totalDepositAmount:"₹ "+this.addCommasToNumber(result[i]?.maturityDetails[j]?.totalDepositAmount.toFixed(2)),
            totalMaturityAmount:"₹ "+this.addCommasToNumber(result[i]?.maturityDetails[j]?.totalMaturityAmount.toFixed(2)),
          }
        )
      }
    }
    console.log(this.data)
  }
  addCommasToNumber(value: number | string): string {
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}


