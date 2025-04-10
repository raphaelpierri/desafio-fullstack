import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService, Endereco } from '../../../services/cep.service';
import { FornecedorService } from '../../../services/fornecedor.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CepMaskDirective } from '../../../directives/cep-mask.directive';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';
import { CpfMaskDirective } from '../../../directives/cpf-mask.directive';
import { VinculacaoComponent } from '../../vinculacao/vinculacao.component';
import { RgMaskDirective } from '../../../directives/rg-mask.directive';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cadastrar-fornecedor',
  standalone: true,
  imports: [
    CommonModule,
    VinculacaoComponent,
    ReactiveFormsModule,
    RouterModule,
    CepMaskDirective,
    CnpjMaskDirective,
    CpfMaskDirective,
    RgMaskDirective
  ],
  templateUrl: './cadastrar-fornecedor.component.html',
  styleUrl: './cadastrar-fornecedor.component.scss'
})
export class CadastrarFornecedorComponent {
  fornecedorForm!: FormGroup;
  enderecoEncontrado = true;
  empresasVinculadas: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private fornecedorService: FornecedorService,
        private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.validateCep();
    this.setupTipoValidations();
  }

  private createForm(): void {
    this.fornecedorForm = this.fb.group({
      tipo: ['PF', Validators.required],
      documento: ['', [Validators.required]],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      rg: [''],
      dataNascimento: [''],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: [''],
      bairro: [''],
      cidade: [''],
      estado: ['']
    });
  }

  private setupTipoValidations(): void {
    this.fornecedorForm.get('tipo')?.valueChanges.subscribe(tipo => {
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
    if (this.fornecedorForm.valid && this.enderecoEncontrado) {
      const formData = this.fornecedorForm.value;
      const rawData = {
        ...formData,
        documento: formData.documento.replace(/\D/g, ''),
        rg: formData.rg?.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, '')
      };

      const dados = {
        ...rawData,
        empresasIds: this.empresasVinculadas.map(e => e.id)
      };

      this.fornecedorService.create(dados).subscribe({
        next: () => {
          this.toastr.success('Fornecedor cadastrado com sucesso!');
          this.router.navigate(['/lista-fornecedores']);
        },
        error: (erro) => console.error('Erro ao cadastrar:', erro)
      });
    }
  }

  onVoltar() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
