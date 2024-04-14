import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeUsernameView } from './change-username.view';

describe('ChangeUsernameComponent', () => {
  let component: ChangeUsernameView;
  let fixture: ComponentFixture<ChangeUsernameView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeUsernameView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeUsernameView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
