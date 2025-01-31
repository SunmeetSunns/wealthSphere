import { Component, Inject, OnInit, PLATFORM_ID,ViewChild,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent implements OnInit {
  private apiUrl = environment.apiUrl;
  showModal: boolean = false;
  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
  forEdit: boolean = false;
  private platformId: Object;
  modalText: string='';
  currentText: String | undefined;
  userData: any;

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
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
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
          totalValue: parseFloat(this.dataForEdit?.totalValue.replace(/,/g, '')),
          currentPrice: parseFloat(this.dataForEdit?.currentPrice.replace(/,/g, '')),
        });
        console.log(this.stockForm.get('currentPrice')?.value)
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
    this.stockForm.markAllAsTouched()
    if (this.stockForm.valid) {
      const formData = this.stockForm.value;
      if (this.forEdit && this.orderId && req == 'edit') {
        const payload = {
          ...formData,
          totalValue: this.stockForm.get('totalValue')?.value || 0,
          orderId: this.orderId,
          username:this.userData?.username,
        };

        this.http.post(`${this.apiUrl}/api/portfolio/updateStock`, payload)
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
          orderId: this.orderId,
          username:this.userData?.username,
        }
        this.http.post(`${this.apiUrl}/api/portfolio/deleteStock`, payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/stocks']);
          }
        })
      }
      else if (!this.forEdit) {
        const payload = {
          ...formData,
          username:this.userData?.username,
          totalValue: this.stockForm.get('totalValue')?.value || 0
        };

        this.http.post(`${this.apiUrl}/api/portfolio/putstock`, payload)
          .subscribe(response => {
            if(response){
              this.router.navigate(['/add-investment/stocks']);
            }
          }, error => {
            console.error('Error adding stock:', error);
          });
      }
      this.modal.dismissAll()
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

