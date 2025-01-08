import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-crypto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, CalendarModule],
  templateUrl: './add-crypto.component.html',
  styleUrl: './add-crypto.component.css'
})
export class AddCryptoComponent {

  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
  forEdit: boolean = false;
  private platformId: Object;
  modalText: string='';
  currentText: String | undefined;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private modal:NgbModal,
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
          type: this.dataForEdit?.type,
          currentValue:  parseFloat(this.dataForEdit?.currentValue.replace(/,/g, '')),
          quantity: this.dataForEdit?.quantity,
          purchasePrice: this.dataForEdit?.purchasePrice,
          totalValue:  parseFloat(this.dataForEdit?.totalValue.replace(/,/g, '')),
          purchaseDate: this.dataForEdit?.purchaseDate
        });
      }
    }
  }

  buildForm() {
    this.stockForm = this.fb.group({
      type: ['', Validators.required],
      currentValue: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      totalValue: [{ value: '', disabled: true }],
      purchaseDate: ['', Validators.required]
    });

    // Optionally, subscribe to changes in purchasePrice or quantity to update totalValue
    this.stockForm.get('quantity')?.valueChanges.subscribe(() => this.updateTotalValue());
    this.stockForm.get('currentValue')?.valueChanges.subscribe(() => this.updateTotalValue());
  }
  updateTotalValue() {
    const quantity = this.stockForm.get('quantity')?.value || 0;
    const currentValue = this.stockForm.get('currentValue')?.value || 0;
    const totalValue = quantity * currentValue;
    this.stockForm.get('totalValue')?.setValue(totalValue, { emitEvent: false });
  }

  onSubmit(req: string) {
    this.stockForm.markAllAsTouched()
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      if (this.forEdit && this.orderId && req == 'edit') {
        const payload = {
          ...formData,
          orderId: this.orderId
        };

        this.http.post('http://localhost:3000/api/portfolio/updateCrypto', payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/']);
            }
          }, error => {
            console.error('Error updating stock:', error);
          });
      }
      if (this.forEdit && this.orderId && req == 'delete') {

        const payload = {
          orderId: this.orderId
        }
        this.http.post('http://localhost:3000/api/portfolio/deleteCrypto', payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/crypto']);
          }
        })
      }
      else if (!this.forEdit) {
        const payload = {
          ...formData,
          "totalValue": this.stockForm.get('totalValue')?.value,
        };

        this.http.post('http://localhost:3000/api/portfolio/putcrypto', payload)
          .subscribe(response => {
           if(response){
            this.router.navigate(['/add-investment/crypto']);
           }
          }, error => {
            console.error('Error adding stock:', error);
          });
      }
      this.modal.dismissAll();
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
  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('Data_for_Edit')) {
      sessionStorage.removeItem('Data_for_Edit');
    }
  }

}

