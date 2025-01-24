import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../loader.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  standalone: true, // Ensure it's standalone
  imports: [CommonModule],
  templateUrl:'./spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent {
  isLoading$!: Observable<boolean>; // Declare but don't access it before initialization

  constructor(private loaderService: LoaderService) {
    // Safely initialize the observable in the constructor
    this.isLoading$ = this.loaderService.loading$;
  }
}
