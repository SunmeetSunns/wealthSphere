import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.css'
})
export class ActionsComponent {

  constructor(private router: Router, private modal: NgbModal) {

  }
  ngOnInit() {

  }
  routeToaddReport(modal: any) {
    if (sessionStorage.getItem('newUser')) {
      this.modal.open(modal, { size: 'md', centered: true })
    }
    else {
      this.router.navigate(['/view-reports/reports']);
    }

  }
  routeToSetup(){
    this.router.navigate(['account-setup']);
    this.modal.dismissAll();
  }
  routeToaddInvest(modal: any) {
    if (sessionStorage.getItem('newUser')) {
      this.modal.open(modal, { size: 'md', centered: true })
    }
    else {
      this.router.navigate(['/add-investment/initialise']);
    }

  }

  close() {
    this.modal.dismissAll();
  }
}
