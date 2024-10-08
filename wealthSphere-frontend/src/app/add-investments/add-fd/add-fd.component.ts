import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-fd',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-fd.component.html',
  styleUrls: ['./add-fd.component.css']
})
export class AddFdComponent implements OnInit {
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
          bankName: this.dataForEdit.bank,
          depositAmount: this.dataForEdit.amount,
          interestRate: this.dataForEdit.interest_rate,
          tenure: this.dataForEdit.tenure,
          maturityDate: this.dataForEdit.maturity_date,
          expectedReturn: this.dataForEdit.expected_return,
        });
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
      tenure: ['', Validators.required], // In days
      interestRate: ['', [Validators.required, Validators.min(0)]],
      maturityDate: ['', [Validators.required]],
      expectedReturn: [{ value: '', disabled: true }, [Validators.required]], // Disable input for expectedReturn
      bankName: ['', [Validators.required]],
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

    const depositAmount = formData.depositAmount;
    const interestRate = formData.interestRate;
    const tenure = formData.tenure;

    if (depositAmount && interestRate && tenure) {
      const maturityAmount = this.calculateMaturityAmount(depositAmount, interestRate, tenure);

      // Update the form's expectedReturn field with the calculated maturity amount
      this.stockForm.patchValue({ expectedReturn: maturityAmount }, { emitEvent: false });
    }
  }

  onSubmit(req: string) {
    debugger
    if (this.stockForm.valid) {
      const formData = this.stockForm.getRawValue(); // Get raw form data, including disabled fields like expectedReturn

      if (this.forEdit && this.orderId && req === 'edit') {
        const payload = {
          ...formData,
          orderId: this.orderId
        };

        this.http.post('http://localhost:3000/api/portfolio/updatefd', payload)
          .subscribe(response => {
            if (response) {
              this.router.navigate(['/add-investment/fd']);
            }
          }, error => {
            console.error('Error updating FD:', error);
          });
      } else if (this.forEdit && this.orderId && req === 'delete') {
        const payload = { orderId: this.orderId };

        this.http.post('http://localhost:3000/api/portfolio/deletefd', payload).subscribe(response => {
          if (response) {
            this.router.navigate(['/add-investment/fd']);
          }
        });
      } else if (!this.forEdit) {
        const payload = { ...formData };

        this.http.post('http://localhost:3000/api/portfolio/addfd', payload)
          .subscribe(response => {
            console.log('FD added successfully:', response);
          }, error => {
            console.error('Error adding FD:', error);
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
