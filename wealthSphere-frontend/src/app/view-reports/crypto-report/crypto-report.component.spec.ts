import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoReportComponent } from './crypto-report.component';

describe('CryptoReportComponent', () => {
  let component: CryptoReportComponent;
  let fixture: ComponentFixture<CryptoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptoReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
