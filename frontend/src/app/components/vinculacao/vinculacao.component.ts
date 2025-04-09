import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vinculacao',
  templateUrl: './vinculacao.component.html',
  styleUrls: ['./vinculacao.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
      RouterModule, FormsModule],
})
export class VinculacaoComponent {
  @Input() titulo!: string;
  @Input() tipo!: string;
  @Input() itensVinculados: any[] = [];
  @Output() atualizarVinculos = new EventEmitter<any[]>();

  termoBusca = '';
  resultadosBusca: any[] = [];

  abrirModalBusca(): void {
    this.resultadosBusca = [];
    // @ts-ignore
    new bootstrap.Modal('#buscaModal').show();
  }

  selecionarItem(item: any): void {
    if (!this.itensVinculados.find(i => i.id === item.id)) {
      this.itensVinculados.push(item);
      this.atualizarVinculos.emit(this.itensVinculados);
    }
    // @ts-ignore
    bootstrap.Modal.getInstance('#buscaModal').hide();
  }

  removerVinculo(item: any): void {
    this.itensVinculados = this.itensVinculados.filter(i => i.id !== item.id);
    this.atualizarVinculos.emit(this.itensVinculados);
  }
}
