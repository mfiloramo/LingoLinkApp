import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationView } from './registration.view';

describe('RegistrationComponent', () => {
  let component: RegistrationView;
  let fixture: ComponentFixture<RegistrationView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationView ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrationView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
