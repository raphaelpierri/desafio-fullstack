import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarEmpresaComponent } from './pesquisar-empresa.component';

describe('PesquisarEmpresaComponent', () => {
  let component: PesquisarEmpresaComponent;
  let fixture: ComponentFixture<PesquisarEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarEmpresaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisarEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
