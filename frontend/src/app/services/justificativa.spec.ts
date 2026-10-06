import { TestBed } from '@angular/core/testing';
import { Justificativa } from './justificativa';

describe('Justificativa', () => {
  let service: Justificativa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Justificativa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
