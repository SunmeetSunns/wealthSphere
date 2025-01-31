import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-account-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './account-settings.component.html',
  styleUrl: './account-settings.component.css'
})
export class AccountSettingsComponent implements OnInit {
  apiUrl = environment?.apiUrl
  accountForm!: FormGroup
  newUser: any = false;
  email: any;
  userData: any;
  profileData: any;
  constructor(private formBuilder: FormBuilder, private http: HttpClient,private router:Router,private modal: NgbModal) {

  }
  ngOnInit(): void {
    const user = localStorage.getItem('userData');
    if (user) {
      this.userData = JSON.parse(user)
    }
    this.email = this.userData?.username
    if (sessionStorage.getItem('newUser')) {
      const isTrue = sessionStorage.getItem('newUser')
      this.newUser = isTrue;
      this.buildForm();
      this.fillForm();
    }
    else {
      this.newUser = false;
      this.getAccountDetails();
    }

  }
  setUpAccount(){
    let body={
      accountNo:this.accountForm.get('account_no')?.value,
      account_name:this.accountForm.get('account_name')?.value,
      username:this.accountForm.get('username')?.value,
      address:this.accountForm.get('address')?.value,
      birth_date:this.accountForm.get('birth_date')?.value,
      gender:this.accountForm.get('gender')?.value,
      pan_no:this.accountForm.get('pan_no')?.value,
      aadhar_no:this.accountForm.get('aadhar_no')?.value
    }
    let url=`${this.apiUrl}/api/user/setUpAccount`;
    this.http.post(url,body).subscribe((res)=>{
      if(res){
        this.removeNewAccountSetting(res);
      }
    })
  }
  removeNewAccountSetting(res:any){
    if(res?.success){
      sessionStorage.removeItem('newUser');
      // this.modal.open('Success',({size:'md',centered:true}))
      this.newUser=false;
      this.getAccountDetails();
    }
  }
 formatDateToDDMMYYYY(dateString:any) {
    // Convert the date string to a Date object
    const date = new Date(dateString);
  
    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear(); // Get the full year
  
    // Format the date as dd-mm-yyyy
    return `${day}-${month}-${year}`;
  }
  getAccountDetails() {
    let body = {
      username: this.email
    }
    let url = `${this.apiUrl}/api/user/accountInfo`;
    this.http.post(url, body).subscribe((res) => {
      if (res) {
        this.populateData(res)
      }

    })
  }
  populateData(res: any) {
    this.profileData = res?.accountDetails;
  }
  simonGoBack()
  {
    this.router.navigate(['/'])
  }
  fillForm(){
    this.accountForm.get('username')?.setValue(this.userData?.username);
    this.accountForm.get('account_name')?.setValue(this.userData?.first_name);
  }
  buildForm() {
    this.accountForm = this.formBuilder.group({
      account_no: ['', Validators.required],
      account_name: [{ value: '', disabled: true }, Validators.required],
      pan_no: ['', Validators.required],
      aadhar_no: ['', Validators.required],
      username:[{ value: '', disabled: true }, Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      birth_date: ['', Validators.required],
    })
  }

}
