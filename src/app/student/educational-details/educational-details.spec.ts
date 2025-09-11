import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalDetails } from './educational-details';

describe('EducationalDetails', () => {
  let component: EducationalDetails;
  let fixture: ComponentFixture<EducationalDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationalDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationalDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
