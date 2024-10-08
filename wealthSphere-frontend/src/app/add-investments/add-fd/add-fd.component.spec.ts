import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFdComponent } from './add-fd.component';

describe('AddFdComponent', () => {
  let component: AddFdComponent;
  let fixture: ComponentFixture<AddFdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFdComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
