import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarView } from './avatar.view';

describe('AvatarComponent', () => {
  let component: AvatarView;
  let fixture: ComponentFixture<AvatarView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
