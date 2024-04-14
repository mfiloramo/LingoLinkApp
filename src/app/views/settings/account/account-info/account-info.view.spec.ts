import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoView } from './account-info.view';

describe('AccountInfoComponent', () => {
  let component: AccountInfoView;
  let fixture: ComponentFixture<AccountInfoView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfoView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
