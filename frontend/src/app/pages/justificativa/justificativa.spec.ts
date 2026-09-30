import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Justificativa } from './justificativa';

describe('Justificativa', () => {
  let component: Justificativa;
  let fixture: ComponentFixture<Justificativa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Justificativa],
    }).compileComponents();

    fixture = TestBed.createComponent(Justificativa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
