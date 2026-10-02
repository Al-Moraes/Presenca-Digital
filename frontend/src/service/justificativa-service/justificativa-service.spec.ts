import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JustificativaService } from './justificativa-service';

describe('JustificativaService', () => {
  let component: JustificativaService;
  let fixture: ComponentFixture<JustificativaService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JustificativaService],
    }).compileComponents();

    fixture = TestBed.createComponent(JustificativaService);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
