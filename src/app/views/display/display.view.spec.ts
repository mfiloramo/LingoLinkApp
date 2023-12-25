import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayView } from './display.view';

describe('DisplayViewTsComponent', () => {
  let component: DisplayView;
  let fixture: ComponentFixture<DisplayView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
