import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordView } from './change-password.view';

describe('ChangeUsernameComponent', () => {
  let component: ChangePasswordView;
  let fixture: ComponentFixture<ChangePasswordView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePasswordView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePasswordView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
