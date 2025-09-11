import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDocApproval } from './pending-doc-approval';

describe('PendingDocApproval', () => {
  let component: PendingDocApproval;
  let fixture: ComponentFixture<PendingDocApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDocApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDocApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
