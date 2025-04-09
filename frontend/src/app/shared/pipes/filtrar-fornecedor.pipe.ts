import { Pipe, PipeTransform } from '@angular/core';
import { Fornecedor, TipoPessoa } from '../../models/fornecedor.model';

@Pipe({
  name: 'filtrarFornecedor',
  standalone: true
})
export class FiltrarFornecedorPipe implements PipeTransform {
  transform(fornecedores: Fornecedor[], nome: string, documento: string): Fornecedor[] {
    return fornecedores.filter(f => {
      const matchNome = f.nome.toLowerCase().includes(nome.toLowerCase());
      const doc = f.tipoPessoa === TipoPessoa.FISICA ? f.cpf : f.cnpj;
      const matchDoc = doc?.includes(documento);
      return matchNome && matchDoc;
    });
  }
}
