import { Component, OnInit } from '@angular/core';
import { FetchNewsComponent } from '../../add-investments/fetch-news/fetch-news.component';
import { NewsComponent } from "../../news/news.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FetchNewsComponent, NewsComponent],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css'
})
export class ReportsComponent implements OnInit {
  constructor(public router: Router) {

  }
  ngOnInit(): void {

  }
  routeToReport(module: any) {
    this.router.navigate([`/view-reports/${module}`])
  }
}
