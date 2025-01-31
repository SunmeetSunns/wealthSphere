import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsComponent } from "../../news/news.component";
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-investment',
  standalone: true,
  imports: [NewsComponent],
  templateUrl: './add-investment.component.html',
  styleUrl: './add-investment.component.css'
})
export class AddInvestmentComponent {
   private apiUrl = environment.apiUrl;
  totals: any;
  userData: any;
  constructor(private router: Router,private http:HttpClient) {

  }

  ngOnInit() {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
    this.getTotals()
  }
  getTotals(){
    let url=`${this.apiUrl}/api/portfolio/portfolioTotal`
    let body={
      username:this.userData?.username
    }
this.http.post(url,body).subscribe((res)=>{
  if(res){
    this.totals=res;
  }
})
  }
  routeTo(where:String){
    this.router.navigate([`/add-investment/${where}`])
  }
  addCommasToNumber(value: number | string): string {
    if(value==null){
      return ''
    }
    if (typeof value === "number") {
      value = value.toString();
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
