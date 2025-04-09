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
  empresasVinculadas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private fornecedorService: FornecedorService
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
      rg: [''],
      dataNascimento: [''],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });
  }

  private loadFornecedorData(): void {
    this.fornecedorService.findById(this.id).subscribe({
      next: (fornecedor) => {
        this.fornecedorForm.patchValue(fornecedor);
        this.empresasVinculadas = fornecedor.empresas;
        this.setupTipoValidations();
      }
    });
  }

  private setupTipoValidations(): void {
    const tipo = this.fornecedorForm.get('tipo')?.value;
    const documentoControl = this.fornecedorForm.get('documento');
    const rgControl = this.fornecedorForm.get('rg');
    const dataNascimentoControl = this.fornecedorForm.get('dataNascimento');

    if (tipo === 'PF') {
      documentoControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
      ]);
      rgControl?.setValidators([Validators.required]);
      dataNascimentoControl?.setValidators([Validators.required]);
    } else {
      documentoControl?.setValidators([
        Validators.required,
        Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
      ]);
      rgControl?.clearValidators();
      dataNascimentoControl?.clearValidators();
    }

    documentoControl?.updateValueAndValidity();
    rgControl?.updateValueAndValidity();
    dataNascimentoControl?.updateValueAndValidity();
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

  onSubmit(): void {
    if (this.fornecedorForm.valid) {
      const rawData = {
        ...this.fornecedorForm.value,
        documento: this.fornecedorForm.value.documento.replace(/\D/g, ''),
        empresasIds: this.empresasVinculadas.map(e => e.id)
      };

      this.fornecedorService.updateById(this.id, rawData).subscribe({
        next: () => {
          alert('Fornecedor atualizado com sucesso!');
          this.router.navigate(['/fornecedores']);
        },
        error: (erro) => console.error('Erro ao atualizar:', erro)
      });
    }
  }

  onVoltar() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
