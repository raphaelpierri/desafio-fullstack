import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService, Endereco } from '../../../services/cep.service';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CepMaskDirective } from '../../../directives/cep-mask.directive';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';
import { VinculacaoComponent } from '../../vinculacao/vinculacao.component';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../services/fornecedor.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-cadastrar-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CepMaskDirective, CnpjMaskDirective, VinculacaoComponent],
  templateUrl: './cadastrar-empresa.component.html',
  styleUrl: './cadastrar-empresa.component.scss'
})
export class CadastrarEmpresaComponent {
  empresaForm!: FormGroup;
  fornecedoresVinculados: any[] = [];
  enderecoEncontrado = false
  validacaoRegraParana = true


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private empresaService: EmpresaService,
    private fornecedorService: FornecedorService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.validateCep();
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

  atualizarFornecedores(fornecedores: any[]): void {
    this.fornecedoresVinculados = fornecedores;
  }


  onSubmit(): void {
    if (this.empresaForm.valid) {
      const dados = {
        ...this.empresaForm.value,
        fornecedores: this.fornecedoresVinculados.map(e => e.id)
      };

      const isParana = this.empresaForm.get('estado')?.value === 'PR';

      if (this.fornecedoresVinculados.length > 0 && isParana) {
        const algumMenor = this.fornecedoresVinculados.some(f => {
          const data = new Date(f.dataNascimento);
          const idade = this.fornecedorService.calcularIdade(data);
          return idade < 18;
        });

        if (algumMenor) {
          this.toastr.warning('Não é possível vincular fornecedores menores de idade a empresas do Paraná!');
          return;
        }
      }

      this.empresaService.create(dados).pipe(
        catchError((erro) => {
          console.error('Erro ao cadastrar empresa:', erro);
          this.toastr.warning(erro.error.message);
          return of(null);
        })
      ).subscribe((res) => {
        if (res) {
          this.toastr.success('Empresa cadastrada com sucesso!');
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  onVoltar () {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
