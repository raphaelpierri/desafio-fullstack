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
import { catchError, firstValueFrom, of } from 'rxjs';
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
      rg: [null],
      dataNascimento: [null],
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
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

        this.fornecedorForm.patchValue({
          documento: '',
          rg: '',
          dataNascimento: ''
        });

      } else {

        documentoControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
        ]);
        rgControl?.clearValidators();
        dataNascimentoControl?.clearValidators();

        this.fornecedorForm.patchValue({
          documento: '',
          rg: '',
          dataNascimento: ''
        });
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

  async onSubmit(): Promise<void> {
    if (this.fornecedorForm.invalid || !this.enderecoEncontrado) {
      this.fornecedorForm.markAllAsTouched();
      return;
    }

    const fornecedor = this.fornecedorForm.value;
    const rawData = {
      ...fornecedor,
      documento: fornecedor.documento.replace(/\D/g, ''),
      rg: fornecedor.rg?.replace(/\D/g, ''),
      cep: fornecedor.cep.replace(/\D/g, '')
    };

    const dados = {
      ...rawData,
      empresas: this.empresasVinculadas.map(e => e.id)
    };

    const isPessoaFisica = fornecedor.rg !== null && fornecedor.rg !== '';
    const dataNascimento = new Date(fornecedor.dataNascimento);
    const idade = this.fornecedorService.calcularIdade(dataNascimento);

    if (isPessoaFisica && idade < 18 && this.empresasVinculadas.length > 0) {
      try {
        const enderecos = await Promise.all(
          this.empresasVinculadas.map(e => firstValueFrom(this.cepService.buscarEndereco(e.cep)))
        );

        const algumaEmpresaDoPR = enderecos.some(endereco => endereco?.uf === 'PR');

        if (algumaEmpresaDoPR) {
          this.toastr.warning('Não é possível vincular um fornecedor pessoa física menor de idade a uma empresa do Paraná.');
          return;
        }
      } catch (error) {
        this.toastr.error('Erro ao validar endereços vinculados.');
        return;
      }
    }
    if (!isPessoaFisica) {
      dados.rg = null;
      dados.dataNascimento = null;
    }
    this.fornecedorService.create(dados).pipe(
      catchError((erro) => {
        console.error('Erro ao cadastrar fornecedor:', erro);
        this.toastr.warning(erro.error.message);
        return of(null);
      })
    ).subscribe((res) => {
      if (res) {
        this.toastr.success('Fornecedor cadastrado com sucesso!');
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }


  onVoltar() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
