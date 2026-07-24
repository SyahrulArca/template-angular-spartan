import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormatToggle } from './number-format-toggle';

describe('NumberFormatToggle', () => {
  let component: NumberFormatToggle;
  let fixture: ComponentFixture<NumberFormatToggle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberFormatToggle],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberFormatToggle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
