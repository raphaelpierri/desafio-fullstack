import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import {  ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Empresa } from '../../../models/empresa.model';
import { CnpjPipe } from '../../../shared/pipes/cnpj.pipe';
import { CepPipe } from '../../../shared/pipes/cep.pipe';

@Component({
  selector: 'app-pesquisar-empresa',
  standalone: true,
  imports: [CommonModule, CnpjPipe, CepPipe, RouterModule ],
  templateUrl: './pesquisar-empresa.component.html',
  styleUrl: './pesquisar-empresa.component.scss'
})
export class PesquisarEmpresaComponent {
  empresas: Empresa[] = [];
  loading = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  carregarEmpresas(): void {
    this.empresaService.findAll().subscribe({
      next: (data: Empresa[]) => {
        this.empresas = data;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Erro ao carregar empresas');
        this.loading = false;
      }
    });
  }

  onAdd(): void {
    this.router.navigate(['cadastrar'], { relativeTo: this.route });
  }

  onEdit(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  onDelete(id: number): void {
    if(confirm('Deseja realmente excluir esta empresa?')) {
      this.empresaService.delete(id).subscribe({
        next: () => {
          this.toastr.success('Empresa excluída com sucesso');
          this.carregarEmpresas();
        },
        error: () => this.toastr.error('Erro ao excluir empresa')
      });
    }
  }
}
