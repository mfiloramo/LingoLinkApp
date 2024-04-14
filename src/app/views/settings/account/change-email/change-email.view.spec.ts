import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeEmailView } from './change-email.view';

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailView;
  let fixture: ComponentFixture<ChangeEmailView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeEmailView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeEmailView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
