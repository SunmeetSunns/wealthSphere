import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-fetch-news',
  standalone: true,
  imports: [CommonModule, TableModule],
  templateUrl: './fetch-news.component.html',
  styleUrl: './fetch-news.component.css'
})
export class FetchNewsComponent implements OnInit {

  data: any[] = [];
  columns: any[] = [];
  heading: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.route.url.subscribe(urlSegments => {
      const urlPath = urlSegments.map(segment => segment.path).join('/');
      this.fetchNewsBasedOnUrl(urlPath);
    });
    this.populateSchema(this.heading);
    this.getData(this.heading);
  }

  populateSchema(heading: string) {
    if (heading == 'Stocks') {
      this.columns = [
        {
          field: 'stocks', header: 'Stocks'
        },
        { field: 'marketPrice', header: 'Market Price' },
        { field: 'change', header: 'Change(%)' }
      ]
    }
    if (heading == 'Cash') {
      this.columns = [
        { field: 'currency', header: 'Currency' },
        { field: 'exchange_rate', header: 'Exchange Rate' },
        { field: 'actual_price', header: 'Estimated Value(INR)' }
      ]
    }
    if (heading == 'Crypto') {
      this.columns = [
        { field: 'symbol', header: 'Symbol' },
        { field: 'cmc_rank', header: 'CMC Rank' },
        { field: 'circulating_supply', header: 'Circulating Supply' },
        { field: 'total_supply', header: 'Total Supply' },
        { field: 'max_supply', header: 'Max Supply' },
        // {field:''}
      ]
    }
    if(this.heading=='FD'){
      this.columns=[
        {field:'bank_name',header:'Bank Name'},
        {field:'citizen_rate',header:'General Citizen Rate'},
        {field:'old_citizen_rate',header:'Senior Citizen Rate'}
      ]
    }
  }
  getData(heading: string) {
    let url;
    if (heading == 'Stocks') {
      url = 'https://wealtsphere.onrender.com/api/portfolio/getGainers';
      this.http.get(url).subscribe((res) => {
        if (res) {
          this.populateData(res);
        }
      })
    }
    if (heading == 'Cash') {
      url = 'https://wealtsphere.onrender.com/api/portfolio/exchangeRates'
      this.http.get(url).subscribe((res) => {
        sessionStorage.setItem('ExchangeRates',JSON.stringify(res))
        this.populateData(res);
      })
    }
    if (heading == 'Crypto') {
      url = 'https://wealtsphere.onrender.com/api/portfolio/cryptoRates'
      this.http.get(url).subscribe((res) => {
        this.populateData(res);
      })
    }
    if(heading=='FD'){
      url='https://wealtsphere.onrender.com/api/portfolio/fdRates'
      this.http.get(url).subscribe((res)=>{
        this.populateData(res);
      })
    }
  }
  populateData(res: any) {
    this.data = [];
    if (this.heading == 'Stocks') {
      const gainers = res?.top_gainers; // Ensure you're working with the top_gainers array
      if (gainers && gainers.length) {
        for (let i = 0; i < 5; i++) {
          this.data.push({
            stocks: gainers[i]?.ticker,       // Access top_gainers directly
            marketPrice: gainers[i]?.price,    // Change 'marketPrice' to 'price' if that's the key from the API
            change: gainers[i]?.change_percentage // Assuming this is the key for the change percentage
          });
        }
      }
    }
    if (this.heading == 'Cash') {
      for (let i = 0; i < 5; i++) {
        this.data.push({
          currency: res[i].currency,
          exchange_rate: res[i].exchange_rate,
          actual_price: '₹ '+(res[i].actual_price).toFixed(2),
          svg_url: res[i].svg_url
        })
      }
    }
    if (this.heading == 'Crypto') {
      for (let i = 0; i < 5; i++) {
        this.data.push({
          symbol: res?.data[i]?.symbol,
          cmc_rank: res?.data[i].cmc_rank,
          circulating_supply: res?.data[i].circulating_supply,
          total_supply: res?.data[i].total_supply,
          max_supply: res?.data[i].max_supply,
        })
      }
    }
    if(this.heading=='FD'){
     for(let i=0;i<res?.length;i++){
      this.data.push({
        bank_name:res[i].bank,
        citizen_rate:res[i].generalCitizensRate,
        old_citizen_rate:res[i].seniorCitizensRate

      })
     }
    }
  }

  private fetchNewsBasedOnUrl(url: string): void {
    if (url.includes('stocks')) {
      this.heading = 'Stocks';
    } else if (url.includes('cash')) {
      this.heading = 'Cash';
    }
    else if (url.includes('crypto')) {
      this.heading = 'Crypto';
    }
    else if (url.includes('fd')) {
      this.heading = 'FD';
    } else {
      this.heading = 'Default Heading'; // You can set a default heading or handle other cases here
    }
  }
}
