import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://real-time-finance-data.p.rapidapi.com/market-trends?trend_type=MARKET_INDEXES&country=us&language=en';
  private headers = {
    'x-rapidapi-key': '0bd14eb2cdmshc74f7d07120123ep1eadd7jsnfd2042092d20',
    'x-rapidapi-host': 'real-time-finance-data.p.rapidapi.com'
  };

  constructor() {}

  async getMarketTrends(): Promise<any> {
    try {
      const response = await fetch(this.apiUrl, { method: 'GET', headers: this.headers });
      if (!response.ok) {
        return;
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
     
      console.error('Error fetching market trends:', error);
      return;
    }
  }
}
