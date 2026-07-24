import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormat } from './number-format';

describe('NumberFormat', () => {
  let component: NumberFormat;
  let fixture: ComponentFixture<NumberFormat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFormat],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberFormat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
