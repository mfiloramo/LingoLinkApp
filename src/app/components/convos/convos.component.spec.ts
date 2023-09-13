import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvosComponent } from './convos.component';

describe('ConvosComponent', () => {
  let component: ConvosComponent;
  let fixture: ComponentFixture<ConvosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
