import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EdiPerfilComponent } from './edi-perfil.component';

describe('EdiPerfilComponent', () => {
  let component: EdiPerfilComponent;
  let fixture: ComponentFixture<EdiPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EdiPerfilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EdiPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
