import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.css'
})
export class ActionsComponent {

  constructor(private router: Router) { 
   
  }
  ngOnInit() {

  }
  routeToaddReport() {
    this.router.navigate(['/view-reports/reports']);
  }
  routeToaddInvest() {
    this.router.navigate(['/add-investment/initialise']);
  }

}
