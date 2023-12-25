import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountView } from './account.view';

describe('AccountViewComponent', () => {
  let component: AccountView;
  let fixture: ComponentFixture<AccountView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
