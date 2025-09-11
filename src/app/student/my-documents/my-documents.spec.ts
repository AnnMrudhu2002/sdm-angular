import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDocuments } from './my-documents';

describe('MyDocuments', () => {
  let component: MyDocuments;
  let fixture: ComponentFixture<MyDocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDocuments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDocuments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
