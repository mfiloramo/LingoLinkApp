import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeNameView } from './change-name.view';

describe('ChangeNameComponent', () => {
  let component: ChangeNameView;
  let fixture: ComponentFixture<ChangeNameView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeNameView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeNameView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
