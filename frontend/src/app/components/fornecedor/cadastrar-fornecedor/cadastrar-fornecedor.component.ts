import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastrar-fornecedor',
  standalone: true,
  imports: [],
  templateUrl: './cadastrar-fornecedor.component.html',
  styleUrl: './cadastrar-fornecedor.component.scss'
})
export class CadastrarFornecedorComponent {





validarIdadeParana(uf: string, dataNascimento: Date): boolean {
  if (uf === 'PR') {
    const idade = this.calcularIdade(dataNascimento);
    return idade >= 18;
  }
  return true;
}

private calcularIdade(dataNascimento: Date): number {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mes = hoje.getMonth() - nascimento.getMonth();

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}
}
