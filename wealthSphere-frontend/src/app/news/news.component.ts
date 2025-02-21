import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NewsService } from '../news.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TruncatePipe } from '../truncate.pipe';
import { environment } from '../../environments/environment';
import { LoaderService } from '../loader.service';  // Import the LoaderService
import { Observable } from 'rxjs';  // To handle the loading state

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  standalone: true,
  imports: [CommonModule, TruncatePipe]
})
export class NewsComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  @Output() toggleNewsComponent = new EventEmitter<boolean>();
  newsArray: any[] = [];
  showNews: boolean = true;
  marketTrends: any;
  loading: boolean = false;
  errorMessage: string = '';
  newsData: any;

  // Inject LoaderService to manage the loading state
  isLoading$: Observable<boolean>;

  constructor(
    private newsService: NewsService,
    private router: Router,
    private http: HttpClient,
    private loaderService: LoaderService  // Injecting LoaderService
  ) {
    this.isLoading$ = this.loaderService.loading$;  // Observable to track loading state
  }

  ngOnInit() {
    this.getNews();
  }

  getData(data?: any) {
    this.newsData = data?.feed;
    if (data) {
      for (let i = 0; i < 6; i++) {
        this.newsArray.push({
          img: this.newsData[i]?.banner_image,
          heading: this.newsData[i]?.title,
          news: this.newsData[i]?.summary,
          date: this.formatDate(this.newsData[i]?.time_published),
          url: this.newsData[i]?.url
        });
      }
    } else {
      for (let i = 0; i <= 5; i++) {
        this.newsArray.push({
          img: '../../assets/stock_report.webp',
          heading: 'Could Buying Roku Stock Today Set You Up for Life?',
          news: 'Roku ( NASDAQ: ROKU ) recently reported financial',
          date: '2025-02-22 06:22:14',
          url: ''
        });
      }
    }
  }

  toggleData() {
    this.showNews = !this.showNews;
    this.toggleNewsComponent.emit(this.showNews);
  }

  formatDate(dateString: string): string {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const hours = dateString.slice(9, 11);
    const minutes = dateString.slice(11, 13);
    const seconds = dateString.slice(13, 15);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  navigateToItem(url: string) {
    this.router.navigateByUrl(url);
  }

  getNews() {
    this.loaderService.show();  // Start the loading spinner
    let url = `${this.apiUrl}/api/portfolio/fetchNews`;
    this.http.get(url).subscribe(
      (res) => {
        this.loaderService.hideWithMinimumDelay();  // Hide the spinner once the data is fetched
        if (res) {
          this.marketTrends = res;
          if (this.marketTrends.Information) {
            this.getData();
          } else {
            this.getData(this.marketTrends);
          }
        }
      },
      (error) => {
        this.loaderService.hideWithMinimumDelay();  // Hide the spinner even if there's an error
        this.errorMessage = 'Error fetching news data';
      }
    );
  }
}
