import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false); // Current loading state
  loading$ = this.loadingSubject.asObservable(); // Observable for components to subscribe to

  constructor() {}

  show() {
    this.loadingSubject.next(true); // Show spinner
  }
 
  hide() {
    this.loadingSubject.next(false); // Hide spinner immediately
  }

  // Hide spinner after 9 seconds, ensuring a fixed minimum delay
  hideWithMinimumDelay() {
    setTimeout(() => {
      this.loadingSubject.next(false); // Hide spinner after 9 seconds
    }, 3000);
  }
}
