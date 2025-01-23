import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-fd',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-fd.component.html',
  styleUrls: ['./add-fd.component.css']
})
export class AddFdComponent implements OnInit {
   private apiUrl = environment.apiUrl;
  stockForm!: FormGroup;
  dataForEdit!: any;
  orderId: any;
  forEdit: boolean = false;
  private platformId: Object;
  modalText: string = '';
  currentText: String | undefined;

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
          bankName: this.dataForEdit?.bank,
          depositAmount: parseFloat(this.dataForEdit?.amount.replace(/,/g, '')),
          interestRate: this.dataForEdit?.interest_rate,
          tenure: this.dataForEdit?.tenure,
          maturityDate: this.dataForEdit?.maturity_date,
          beginningDate: this.dataForEdit?.beginningDate,
          expectedReturn: this.dataForEdit?.expected_return,
        });
        
        console.log(new Date(this.dataForEdit?.maturity_date))
        
      }
    }

    // Subscribe to changes in the form to automatically calculate and update the maturity amount
    this.stockForm.valueChanges.subscribe(() => {
      this.updateMaturityAmount();
    });
  }

  buildForm() {
    this.stockForm = this.fb.group({
      depositAmount: ['', Validators.required],
      interestRate: ['', [Validators.required, Validators.min(0)]],
      maturityDate: ['', [Validators.required]],
      beginningDate: ['', [Validators.required]],

      bankName: ['', [Validators.required]],
      tenure: [{ value: '', disabled: true }, Validators.required], // Disabled from the start
      expectedReturn: [{ value: '', disabled: true }, Validators.required],
    });
  }

  // Method to calculate the FD Maturity Amount
  calculateMaturityAmount(principal: number, rate: number, tenureInDays: number): number {
    const n = 4; // Compounded quarterly
    const r = rate / 100; // Convert interest rate to decimal
    const t = tenureInDays / 365; // Convert tenure from days to years

    // Maturity Amount formula for compounded interest
    const maturityAmount = principal * Math.pow(1 + (r / n), n * t);
    return Math.round(maturityAmount); // Rounding off to nearest integer
  }

  updateMaturityAmount() {
    const formData = this.stockForm.value;
  
    const depositAmount = (formData.depositAmount); // Ensure it's a number
    const interestRate = (formData.interestRate); // Ensure it's a number
    const beginningDate = formData.beginningDate;
    const maturityDate = formData.maturityDate;
  
    if (!isNaN(depositAmount) && !isNaN(interestRate) && beginningDate && maturityDate) {
      const tenureInDays = this.calculateTenureInDays(beginningDate, maturityDate);
      this.stockForm.patchValue({ tenure: tenureInDays }, { emitEvent: false });
  
      const maturityAmount = this.calculateMaturityAmount(depositAmount, interestRate, tenureInDays);
      this.stockForm.patchValue({ expectedReturn: maturityAmount }, { emitEvent: false });
    }
  }
  

  // Helper function to calculate tenure in days
  calculateTenureInDays(beginningDate: string, maturityDate: string): number {
    const beginDate = new Date(beginningDate);
    const maturity = new Date(maturityDate);

    // Calculate the difference in time (in milliseconds)
    const timeDifference = maturity.getTime() - beginDate.getTime();

    // Convert the time difference from milliseconds to days
    return timeDifference / (1000 * 3600 * 24); // Convert to days
  }


  onSubmit(req: string) {
    this.stockForm.markAllAsTouched();
    if (this.stockForm.valid) {
      const formData = this.stockForm.getRawValue(); // Get raw form data, including disabled fields like expectedReturn

      if (this.forEdit && this.orderId && req === 'edit') {
        const payload = {
          ...formData,
          orderId: this.orderId
        };

        this.http.post(`${this.apiUrl}/api/portfolio/updatefd`, payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/fd']);
            }
          }, error => {
            console.error('Error updating FD:', error);
          });
      } else if (this.forEdit && this.orderId && req === 'delete') {
        const payload = { orderId: this.orderId };

        this.http.post(`${this.apiUrl}/api/portfolio/deletefd`, payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/fd']);
          }
        });
      } else if (!this.forEdit) {
        const payload = { ...formData };

        this.http.post(`${this.apiUrl}/api/portfolio/addfd`, payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/fd']);
            }
          }, error => {
            console.error('Error adding FD:', error);
          });
      }
    }
    this.modal.dismissAll();
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId) && sessionStorage.getItem('Data_for_Edit')) {
      sessionStorage.removeItem('Data_for_Edit');
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
}
