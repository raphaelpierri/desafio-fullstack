import { CnpjPipe } from './../../../shared/pipes/cnpj.pipe';
import { CommonModule } from '@angular/common';
import { CpfPipe } from './../../../shared/pipes/cpf.pipe';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FornecedorService } from '../../../services/fornecedor.service';
import { Fornecedor } from '../../../models/fornecedor.model';
import { CepPipe } from '../../../shared/pipes/cep.pipe';
import { FiltrarFornecedorPipe } from '../../../shared/pipes/filtrar-fornecedor.pipe';
import { TipoPessoa } from '../../../models/fornecedor.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pesquisar-fornecedor',
  templateUrl: './pesquisar-fornecedor.component.html',
  styleUrls: ['./pesquisar-fornecedor.component.scss'],
  standalone: true,
  imports: [CommonModule, CnpjPipe, CepPipe, CpfPipe, RouterModule, FiltrarFornecedorPipe, FormsModule]
})
export class PesquisarFornecedorComponent implements OnInit {
  TipoPessoa = TipoPessoa;
  fornecedores: Fornecedor[] = [];
  filtroNome = '';
  filtroDocumento = '';
  loading = true;

  constructor(
    private service: FornecedorService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarFornecedores();
  }

  carregarFornecedores(): void {
    this.service.findAll().subscribe({
      next: (data: Fornecedor[]) => {
        this.fornecedores = data,
        this.loading = false
      },
      error: () => {
        this.toastr.error('Erro ao carregar fornecedores');
        this.loading = false;
      }
    });
  }

  novoFornecedor(): void {
    this.router.navigate(['cadastrar'], { relativeTo: this.route });
  }

  editarFornecedor(id: number): void {
    this.router.navigate(['editar', id], { relativeTo: this.route });
  }

  excluirFornecedor(id: number): void {
    if(confirm('Confirma a exclusão?')) {
      this.service.delete(id).subscribe({
        next: () => {
          this.toastr.success('Fornecedor excluído');
          this.carregarFornecedores();
        },
        error: () => this.toastr.error('Erro ao excluir')
      });
    }
  }
}
