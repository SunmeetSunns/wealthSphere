import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'] // Updated from 'styleUrl' to 'styleUrls'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isLoading = false;
  routerSubscription!: Subscription;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen for navigation events
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.showSpinnerForDelay(10000); // Show for 10 seconds
      } else if (event instanceof NavigationEnd) {
        this.isLoading = false; // Hide after navigation ends
      }
    });
  }

  showSpinnerForDelay(delay: number) {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, delay);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe(); // Clean up subscription
  }
}
