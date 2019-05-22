import { TestBed } from '@angular/core/testing';

import { MultiEditTableService } from './multi-edit-table.service';

describe('MultiEditTableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MultiEditTableService = TestBed.get(MultiEditTableService);
    expect(service).toBeTruthy();
  });
});
