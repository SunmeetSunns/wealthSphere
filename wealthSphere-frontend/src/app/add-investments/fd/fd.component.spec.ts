import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FdComponent } from './fd.component';

describe('FdComponent', () => {
  let component: FdComponent;
  let fixture: ComponentFixture<FdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
