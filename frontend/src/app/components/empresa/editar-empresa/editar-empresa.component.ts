import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CepService, Endereco } from '../../../services/cep.service';
import { EmpresaService } from '../../../services/empresa.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CepMaskDirective } from '../../../directives/cep-mask.directive';
import { CnpjMaskDirective } from '../../../directives/cnpj-mask.directive';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-editar-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CepMaskDirective, CnpjMaskDirective],
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.scss'
})
export class EditarEmpresaComponent {
  id!: number;
  empresaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cepService: CepService,
    private empresaService: EmpresaService
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
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      nomeFantasia: ['', [Validators.required, Validators.minLength(3)]],
      cep: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
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
          this.preencherEndereco(endereco);
        }
      },
      error: () => this.limparCamposEndereco()
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

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const empresaData = this.empresaForm.value;
      // Implementar envio para o serviço
    }
  }

  onVoltar () {
    this.router.navigate(['../../'], {relativeTo: this.route})
  }
}
