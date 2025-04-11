import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmpresaService } from '../../services/empresa.service';
import { FornecedorService } from '../../services/fornecedor.service';
import { FiltroNomePipe } from '../../shared/pipes/filtro-nome.pipe';

@Component({
  selector: 'app-vinculacao',
  templateUrl: './vinculacao.component.html',
  styleUrls: ['./vinculacao.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
      RouterModule, FormsModule, FiltroNomePipe],
})
export class VinculacaoComponent {
  @Input() titulo!: string;
  @Input() tipo!: string;
  @Input() itensVinculados: any[] = [];
  @Output() atualizarVinculos = new EventEmitter<any[]>();


  resultadosBusca: any[] = [];
  filtroBusca = '';

  constructor(
    private empresaService: EmpresaService,
    private fornecedorService: FornecedorService
  ) { }

  abrirModalBusca(): void {
    if (this.tipo == 'empresas') {
      this.empresaService.findAll().subscribe({
        next: (empresas) => {
          this.resultadosBusca = empresas;
        }
      })
    }

    if (this.tipo == 'fornecedores') {
      this.fornecedorService.findAll().subscribe({
        next: (fornecedores) => {
          this.resultadosBusca = fornecedores;
        }
      })
    }
    // @ts-ignore
    new bootstrap.Modal('#buscaModal').show();
  }

  selecionarItem(item: any): void {
      this.itensVinculados.push(item);
      this.atualizarVinculos.emit(this.itensVinculados);
    // @ts-ignore
    bootstrap.Modal.getInstance('#buscaModal').hide();
  }

  removerVinculo(item: any): void {
    this.itensVinculados = this.itensVinculados.filter(i => i.id !== item.id);
    this.atualizarVinculos.emit(this.itensVinculados);
  }
}
