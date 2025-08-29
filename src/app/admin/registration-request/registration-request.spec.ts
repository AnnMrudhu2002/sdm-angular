import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationRequest } from './registration-request';

describe('RegistrationRequest', () => {
  let component: RegistrationRequest;
  let fixture: ComponentFixture<RegistrationRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrationRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
