import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageView } from './language.view';

describe('LanguageComponent', () => {
  let component: LanguageView;
  let fixture: ComponentFixture<LanguageView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LanguageView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
