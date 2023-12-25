import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoView } from './info.view';

describe('InfoComponent', () => {
  let component: InfoView;
  let fixture: ComponentFixture<InfoView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
