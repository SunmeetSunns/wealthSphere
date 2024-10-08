import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {
  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
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
          symbol: this.dataForEdit.symbol,
          company: this.dataForEdit.company,
          purchasePrice: this.dataForEdit.purchasePrice,
          quantity: this.dataForEdit.quantity,
          totalValue: this.dataForEdit.totalValue,
          currentPrice: this.dataForEdit.currentPrice,
        });
      }
    }
  }

  buildForm() {
    this.stockForm = this.fb.group({
      symbol: ['', Validators.required],
      company: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(0)]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      currentPrice: ['', [Validators.required, Validators.min(0)]],
      totalValue: [{ value: '', disabled: true }]
    });

    // Optionally, subscribe to changes in purchasePrice or quantity to update totalValue
    this.stockForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotalValue());
    this.stockForm.get('currentPrice')?.valueChanges.subscribe(() => this.updateTotalValue());
  }

  updateTotalValue() {
    const quantity = this.stockForm.get('quantity')?.value || 0;
    const currentPrice = this.stockForm.get('currentPrice')?.value || 0;
    const totalValue = quantity * currentPrice;
    this.stockForm.get('totalValue')?.setValue(totalValue, { emitEvent: false });
  }

  onSubmit(req: string) {
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      if (this.forEdit && this.orderId && req == 'edit') {
        const payload = {
          ...formData,
          totalValue: this.stockForm.get('totalValue')?.value || 0,
          orderId: this.orderId
        };

        this.http.post('http://localhost:3000/api/portfolio/updateStock', payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/stocks']);
            }
          }, error => {
            console.error('Error updating stock:', error);
          });
      }
      if (this.forEdit && this.orderId && req == 'delete') {

        const payload = {
          orderId: this.orderId
        }
        this.http.post('http://localhost:3000/api/portfolio/deleteStock', payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/stocks']);
          }
        })
      }
      else if (!this.forEdit) {
        const payload = {
          ...formData,
          totalValue: this.stockForm.get('totalValue')?.value || 0
        };

        this.http.post('http://localhost:3000/api/portfolio/putstock', payload)
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
