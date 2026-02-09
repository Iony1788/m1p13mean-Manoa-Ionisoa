import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcheteurRegister } from './acheteur-register';

describe('AcheteurRegister', () => {
  let component: AcheteurRegister;
  let fixture: ComponentFixture<AcheteurRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcheteurRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcheteurRegister);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
