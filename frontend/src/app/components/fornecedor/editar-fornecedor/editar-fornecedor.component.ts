import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService, Endereco } from '../../../services/cep.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CepMaskDirective } from '../../../directives/cep-mask.directive';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';
import { CpfMaskDirective } from '../../../directives/cpf-mask.directive';
import { VinculacaoComponent } from '../../../components/vinculacao/vinculacao.component';
import { RgMaskDirective } from '../../../directives/rg-mask.directive';
import { firstValueFrom } from 'rxjs';
import { EmpresaService } from '../../../services/empresa.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editar-fornecedor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CepMaskDirective,
    CnpjMaskDirective,
    CpfMaskDirective,
    VinculacaoComponent,
    RgMaskDirective
  ],
  templateUrl: './editar-fornecedor.component.html',
  styleUrls: ['./editar-fornecedor.component.scss']
})
export class EditarFornecedorComponent {
  id!: number;
  fornecedorForm!: FormGroup;
  empresasIdsVinculados: any[] = [];
  empresasVinculadas: any[] = [];
  validacaoRegraParana = true
  enderecoEncontrado = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private fornecedorService: FornecedorService,
    private empresaService: EmpresaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = +params.get('id')!;
      this.createForm();
      this.loadFornecedorData();
    });
    this.validateCep();
  }

  private createForm(): void {
    this.fornecedorForm = this.fb.group({
      tipo: ['PF', Validators.required],
      documento: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rg: [null],
      dataNascimento: [null],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });
  }

  get rgDataNascimentoInvalido(): boolean {
    if (this.fornecedorForm.get('tipo')?.value === 'PF') {
      return this.fornecedorForm.get('rg')?.value == null || this.fornecedorForm.get('rg')?.value == '' || this.fornecedorForm.get('dataNascimento')?.value == null || this.fornecedorForm.get('dataNascimento')?.value == '';
    }
    return false;
  }

  private loadFornecedorData(): void {
    this.fornecedorService.findById(this.id).subscribe({
      next: (fornecedor) => {
        this.fornecedorForm.get('documento')?.setValue(fornecedor.cpf ? fornecedor.cpf : fornecedor.cnpj);
        if (fornecedor.rg) {
          this.fornecedorForm.get('tipo')?.setValue('PF');
        } else {
          this.fornecedorForm.get('tipo')?.setValue('PJ');
        }
        this.fornecedorForm.patchValue(fornecedor);
        if (fornecedor.empresas && fornecedor.empresas.length > 0) {
          this.empresasIdsVinculados = fornecedor.empresas.map((empresa) => empresa.id);
          for (let empresaId of this.empresasIdsVinculados) {
            this.empresaService.findById(empresaId).subscribe({
              next: (empresa) => {
                this.empresasVinculadas.push(empresa);
              }
            })
          }
        }
      }
    });
  }

  private validateCep(): void {
    this.fornecedorForm.get('cep')?.valueChanges.subscribe(cep => {
      if (this.cepService.validarFormatoCEP(cep)) {
        this.buscarEndereco(cep);
      }
    });
  }

  buscarEndereco(cep: string): void {
    this.cepService.buscarEndereco(cep).subscribe({
      next: (endereco) => {
        if (endereco) {
          this.preencherEndereco(endereco);
        }
      },
      error: () => this.limparCamposEndereco()
    });
  }

  private preencherEndereco(endereco: Endereco): void {
    this.fornecedorForm.patchValue({
      logradouro: endereco.logradouro,
      bairro: endereco.bairro,
      cidade: endereco.localidade,
      estado: endereco.uf
    });
  }

  private limparCamposEndereco(): void {
    this.fornecedorForm.patchValue({
      logradouro: '',
      bairro: '',
      cidade: '',
      estado: ''
    });
  }

  atualizarEmpresas(empresas: any[]): void {
    this.empresasVinculadas = empresas;
  }


  async onSubmit(): Promise<void> {
    if (this.fornecedorForm.valid) {
      const fornecedor = this.fornecedorForm.value;
      const rawData = {
        ...fornecedor,
        documento: fornecedor.documento.replace(/\D/g, ''),
        empresas: this.empresasVinculadas.map(e => e.id)
      };

      const isPessoaFisica = fornecedor.rg !== null && fornecedor.rg !== '';
      const dataNascimento = new Date(fornecedor.dataNascimento);
      const idade = this.fornecedorService.calcularIdade(dataNascimento);

      if (isPessoaFisica && idade < 18 && this.empresasVinculadas.length > 0) {
        // Buscar os endereços das empresas vinculadas
        const enderecos = await Promise.all(
          this.empresasVinculadas.map(e => firstValueFrom(this.cepService.buscarEndereco(e.cep)))
        );

        const algumaEmpresaDoPR = enderecos.some(endereco => endereco?.uf === 'PR');

        if (algumaEmpresaDoPR) {
          this.toastr.warning('Não é possível vincular um fornecedor pessoa física menor de idade a uma empresa do Paraná.');
          return;
        }
      }

      this.fornecedorService.updateById(this.id, rawData).subscribe({
        next: () => {
          this.toastr.success('Fornecedor atualizado com sucesso!');
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: (erro) => this.toastr.error('Erro ao atualizar:', erro)
      });
    } else {
      this.fornecedorForm.markAllAsTouched();
    }
  }

  onVoltar() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
