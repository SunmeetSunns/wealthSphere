import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdReportComponent } from './fd-report.component';

describe('FdReportComponent', () => {
  let component: FdReportComponent;
  let fixture: ComponentFixture<FdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
