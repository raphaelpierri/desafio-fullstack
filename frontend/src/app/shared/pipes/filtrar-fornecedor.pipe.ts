import { Pipe, PipeTransform } from '@angular/core';
import { Fornecedor, TipoPessoa } from '../../models/fornecedor.model';

@Pipe({
  name: 'filtrarFornecedor',
  standalone: true
})
export class FiltrarFornecedorPipe implements PipeTransform {
  transform(fornecedores: Fornecedor[], nome: string, documento: string): Fornecedor[] {
    if (!fornecedores) return [];

    return fornecedores.filter(f => {
      const nomeOk = nome?.trim() ? f.nome.toLowerCase().includes(nome.toLowerCase()) : true;

      const doc = f.tipoPessoa === TipoPessoa.FISICA ? f.cpf : f.cnpj;
      const docOk = documento?.trim() ? doc?.includes(documento) : true;

      return nomeOk && docOk;
    });
  }
}

