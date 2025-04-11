import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroNome',
  standalone: true
})
export class FiltroNomePipe implements PipeTransform {
  transform(lista: any[], termo: string): any[] {
    if (!termo || termo.trim() === '') {
      return lista;
    }

    const termoLower = termo.toLowerCase();

    return lista.filter(item =>
      (item.nome && item.nome.toLowerCase().includes(termoLower)) ||
      (item.nomeFantasia && item.nomeFantasia.toLowerCase().includes(termoLower))
    );
  }
}
