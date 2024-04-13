import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSettingsView } from './main-settings.view';

describe('MainSettingsComponent', () => {
  let component: MainSettingsView;
  let fixture: ComponentFixture<MainSettingsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSettingsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSettingsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
