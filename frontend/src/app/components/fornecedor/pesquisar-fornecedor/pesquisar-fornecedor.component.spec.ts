import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarFornecedorComponent } from './pesquisar-fornecedor.component';

describe('PesquisarFornecedorComponent', () => {
  let component: PesquisarFornecedorComponent;
  let fixture: ComponentFixture<PesquisarFornecedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PesquisarFornecedorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PesquisarFornecedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
