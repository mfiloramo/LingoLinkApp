import { TestBed } from '@angular/core/testing';

import { DisplayService } from '././display.service';

describe('DarkModeService', () => {
  let service: DisplayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DisplayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
