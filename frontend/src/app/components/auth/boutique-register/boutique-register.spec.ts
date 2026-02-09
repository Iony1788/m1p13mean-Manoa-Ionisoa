import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoutiqueRegister } from './boutique-register';

describe('BoutiqueRegister', () => {
  let component: BoutiqueRegister;
  let fixture: ComponentFixture<BoutiqueRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoutiqueRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoutiqueRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
