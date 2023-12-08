import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsView } from './settings.view';

describe('SettingsViewComponent', () => {
  let component: SettingsView;
  let fixture: ComponentFixture<SettingsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
