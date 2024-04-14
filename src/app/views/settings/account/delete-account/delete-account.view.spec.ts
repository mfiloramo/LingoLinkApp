import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAccountView } from './delete-account.view';

describe('DeleteAccountComponent', () => {
  let component: DeleteAccountView;
  let fixture: ComponentFixture<DeleteAccountView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAccountView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAccountView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
