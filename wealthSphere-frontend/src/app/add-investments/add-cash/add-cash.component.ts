import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { environment } from '../../../environments/environment';
// import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-add-cash',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-cash.component.html',
  styleUrl: './add-cash.component.css'
})
export class AddCashComponent {
  private apiUrl = environment.apiUrl;
  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
  currencies = ['INR', 'USD', 'GBP', 'EUR', 'CAD'];
  currencySymbols: { [key: string]: string } = {
    INR: '₹',
    USD: '$',
    GBP: '£',
    EUR: '€',
    CAD: 'C$'
  };
  currentCurrencySymbol: string = '';
  forEdit: boolean = false;
  private platformId: Object;
  modalText: string = '';
  currentText: String | undefined;
  currencyRate: any;
  isModalVisible: boolean = false;
  exchangeRates: any[] = [];
  selectedCurrenci: any;
  userData: any;
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modal: NgbModal,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.platformId = platformId;
  }

  ngOnInit() {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
    this.buildForm();
    this.onEdit();
  }


  buildForm() {
    this.stockForm = this.fb.group({
      source: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      currency: ['', [Validators.required]],
      estimatedAmt: [{ value: '', disabled: true }, Validators.required],

    });

    // Optionally, subscribe to changes in purchasePrice or quantity to update totalValue
  }
  onEdit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedData = sessionStorage.getItem('Data_for_Edit');
      const rates = sessionStorage.getItem('ExchangeRates');

      if (rates) {
        this.exchangeRates = JSON.parse(rates);
      }
      if (storedData) {
        this.forEdit = true;
        this.dataForEdit = JSON.parse(storedData);
        this.orderId = this.dataForEdit.orderId;

        if (this.currencies.includes(this.dataForEdit.currency)) {
          this.stockForm.patchValue({
            source: this.dataForEdit.source,
            amount: parseFloat(this.dataForEdit?.amount.replace(/,/g, '')),
            estimatedAmt: parseFloat(this.dataForEdit?.inrAmount.replace(/,/g, '')),
            currency: this.dataForEdit.currency,
          });

          // Set the current currency symbol
          this.currentCurrencySymbol = this.currencySymbols[this.dataForEdit.currency];
        }
      }
    }

    this.stockForm.get('amount')?.valueChanges.subscribe(() => {
      this.triggerCalculationIfValid();
    });

    this.stockForm.get('currency')?.valueChanges.subscribe((selectedCurrency) => {
      this.selectedCurrenci = selectedCurrency;
      this.currentCurrencySymbol = this.currencySymbols[selectedCurrency] || '';
      this.triggerCalculationIfValid();
    });

  }
  triggerCalculationIfValid(): void {
    const amt = this.stockForm.get('amount')?.value;
    const selectedCurrency = this.stockForm.get('currency')?.value;

    if (amt && !isNaN(amt) && selectedCurrency) {
      this.calculateEstimatedValue();
    }
  }

  calculateEstimatedValue(): void {
    const amt = this.stockForm.get('amount')?.value;

    if (!amt || isNaN(amt)) {
      console.warn('Amount is invalid or not entered');
      return;
    }

    // Find the exchange rate for the selected currency
    const selectedRate = this.exchangeRates.find(
      (rate) => rate.currency === this.selectedCurrenci
    );

    if (selectedRate) {
      const convertedAmount = amt * selectedRate.actual_price;
      this.stockForm.patchValue(
        {
          estimatedAmt: convertedAmount.toFixed(2),
        },
        { emitEvent: false } // Prevent triggering valueChanges again
      );

    }
  }



  openModal(modal: any, text?: String) {
    this.currentText = text;
    if (text == 'submit') {
      this.modalText = "Are you sure you want to Submit ?"
    }
    if (text == 'edit') {
      this.modalText = "Are you sure you want to Edit?"
    }
    if (text == 'delete') {
      this.modalText = "Are you sure you want to Delete?"
    }
    this.modal.open(modal, { size: 'md', centered: true })
  }
  close() {
    this.modal.dismissAll();
  }
  onSubmit(req: string) {
    this.stockForm.markAllAsTouched()
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      if (this.forEdit && this.orderId && req == 'edit') {
        const payload = {
          ...formData,
          orderId: this.orderId,
          username:this.userData?.username
        };

        this.http.post(`${this.apiUrl}/api/portfolio/updateCash`, payload)
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
          orderId: this.orderId,
          username:this.userData?.username
        }
        this.http.post(`${this.apiUrl}/api/portfolio/deleteCash`, payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/cash']);
          }
        })
      }
      else if (!this.forEdit) {
        const payload = {
          ...formData,
          username:this.userData?.username
        };

        this.http.post(`${this.apiUrl}/api/portfolio/putcash`, payload)
          .subscribe(response => {

            this.router.navigate(['/add-investment/cash']);
          }, error => {
            console.error('Error adding stock:', error);
          });
      }
    }
    this.modal.dismissAll();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('Data_for_Edit')) {
      sessionStorage.removeItem('Data_for_Edit');
      sessionStorage.removeItem('ExchangeRates')
    }
  }
}
