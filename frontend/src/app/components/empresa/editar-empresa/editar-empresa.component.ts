import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService, Endereco } from '../../../services/cep.service';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CepMaskDirective } from '../../../directives/cep-mask.directive';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';
import { map, Observable } from 'rxjs';
import { VinculacaoComponent } from '../../vinculacao/vinculacao.component';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../services/fornecedor.service';

@Component({
  selector: 'app-editar-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CepMaskDirective, CnpjMaskDirective,VinculacaoComponent],
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.scss'
})
export class EditarEmpresaComponent {
  id!: number;
  empresaForm!: FormGroup;
  fornecedoresVinculados: any[] = [];
  enderecoEncontrado = false
  fornecedoresIdsVinculados: any[] = []

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private empresaService: EmpresaService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService
  ) {}

  ngOnInit(): void {
    this.fetchRouteParameters().subscribe(() => {
      this.fillForm();
      this.createForm();
    })
    this.validateCep();
  }

  private fetchRouteParameters(): Observable<any> {
    return this.route.paramMap.pipe(
      map((params) => {
          this.id = +params.get('id')!;
      })
    );
  }

  private createForm(): void {
    this.empresaForm = this.fb.group({
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
      nomeFantasia: ['', [Validators.required, Validators.minLength(3)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });
  }

  private fillForm(): void {
    this.empresaService.findById(this.id).subscribe({
      next: (empresa) => {
        this.empresaForm.patchValue(empresa);
        if (empresa.fornecedores && empresa.fornecedores.length > 0) {
          this.fornecedoresIdsVinculados = empresa.fornecedores.map((fornecedor) => fornecedor.id);
          for (let fornecedorId of this.fornecedoresIdsVinculados) {
            this.fornecedorService.findById(fornecedorId).subscribe({
              next: (fornecedor) => {
                this.fornecedoresVinculados.push(fornecedor);
              }
            })
          }
        }
      }
    })
  }

  private validateCep(): void {
    this.empresaForm.get('cep')?.valueChanges.subscribe(cep => {
      if (this.cepService.validarFormatoCEP(cep)) {
        this.buscarEndereco(cep);
      }
    });
  }

  buscarEndereco(cep: string): void {
    this.cepService.buscarEndereco(cep).subscribe({
      next: (endereco) => {
        if (endereco) {
          this.enderecoEncontrado = true;
          this.preencherEndereco(endereco);
        }
      },
      error: () => {
        this.enderecoEncontrado = false;
        this.limparCamposEndereco();
      }
    });
  }

  atualizarFornecedores(fornecedores: any[]): void {
    this.fornecedoresVinculados = fornecedores;
  }


  private preencherEndereco(endereco: Endereco): void {
    this.empresaForm.patchValue({
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.localidade,
      estado: endereco.uf
    });
  }

  private limparCamposEndereco(): void {
    this.empresaForm.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const rawData = {
        ...this.empresaForm.value,
        fornecedores: this.fornecedoresVinculados.map(e => e.id)
      };

      const isParana = this.empresaForm.get('estado')?.value === 'PR';

      if (this.fornecedoresVinculados.length > 0 && isParana) {
        const algumMenorPF = this.fornecedoresVinculados.some(f => {
          const isPF = f.rg != null;
          const data = new Date(f.dataNascimento);
          const idade = this.fornecedorService.calcularIdade(data);
          return isPF && idade < 18;
        });

        if (algumMenorPF) {
          this.toastr.warning('Não é possível vincular fornecedores PF menores de idade a empresas do Paraná!');
          return;
        }
      }

      this.empresaService.updateById(this.id, rawData).subscribe({
        next: () => {
          this.toastr.success('Empresa atualizada com sucesso!');
          this.router.navigate(['/empresas']);
        },
        error: (erro) => this.toastr.error('Erro ao atualizar:', erro)
      });
    }
  }

  onVoltar () {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
