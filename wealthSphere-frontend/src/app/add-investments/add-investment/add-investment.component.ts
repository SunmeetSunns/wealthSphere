import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsComponent } from "../../news/news.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [NewsComponent],
  templateUrl: './add-investment.component.html',
  styleUrl: './add-investment.component.css'
})
export class AddInvestmentComponent {
  totals: any;
  constructor(private router: Router,private http:HttpClient) {

  }

  ngOnInit() {
    this.getTotals()
  }
  getTotals(){
    let url='http://localhost:3000/api/portfolio/portfolioTotal'
this.http.get(url).subscribe((res)=>{
  if(res){
    this.totals=res;
  }
})
  }
  routeTo(where:String){
    this.router.navigate([`/add-investment/${where}`])
  }
}
