import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-cash',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-cash.component.html',
  styleUrl: './add-cash.component.css'
})
export class AddCashComponent {
  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
  currencies=['INR','USD','GBP','EUR','CAD'];
  forEdit: boolean = false;
  private platformId: Object;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit() {
    // Initialize the form
    this.buildForm();

    // Check if data exists in sessionStorage
    if (isPlatformBrowser(this.platformId)) {
      const storedData = sessionStorage.getItem('Data_for_Edit');
      if (storedData) {
        // Parse the stored data
        this.forEdit = true;
        this.dataForEdit = JSON.parse(storedData);
        this.orderId = this.dataForEdit.orderId;
        // Patch the form with the parsed data
        this.stockForm.patchValue({
          source: this.dataForEdit.source,
          amount: this.dataForEdit.amount,
          currency: this.dataForEdit.currency,
          // currentPrice: this.dataForEdit.currentPrice,
        });
      }
    }
  }

  buildForm() {
    this.stockForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['', Validators.required],
      currency: ['', [Validators.required, Validators.min(0)]],
      // purchasePrice: ['', [Validators.required, Validators.min(0)]],
    });

    // Optionally, subscribe to changes in purchasePrice or quantity to update totalValue
  }

  onSubmit(req: string) {

    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      if (this.forEdit && this.orderId && req == 'edit') {
        const payload = {
          ...formData,
          orderId: this.orderId
        };

        this.http.post('http://localhost:3000/api/portfolio/updateCash', payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/cash']);
            }
          }, error => {
            console.error('Error updating stock:', error);
          });
      }
      if (this.forEdit && this.orderId && req == 'delete') {

        const payload = {
          orderId: this.orderId
        }
        this.http.post('http://localhost:3000/api/portfolio/deleteCash', payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/cash']);
          }
        })
      }
      else if (!this.forEdit) {
        const payload = {
          ...formData,
        };

        this.http.post('http://localhost:3000/api/portfolio/putcash', payload)
          .subscribe(response => {
            console.log('Stock added successfully:', response);
          }, error => {
            console.error('Error adding stock:', error);
          });
      }
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('Data_for_Edit')) {
      sessionStorage.removeItem('Data_for_Edit');
    }
  }
}
