import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  tecnologias = [
    {
      icone: 'bi-angular',
      nome: 'Angular 19',
      descricao: 'Frontend Moderno'
    },
    {
      icone: 'bi-bootstrap',
      nome: 'Bootstrap 5',
      descricao: 'Design Responsivo'
    },
    {
      icone: 'bi-microsoft',
      nome: '.NET Core 9',
      descricao: 'Backend Robustecido com C#'
    },
    {
      icone: 'bi-database',
      nome: 'SQL Server',
      descricao: 'Banco de Dados Relacional'
    },
    {
      icone: 'bi-docker',
      nome: 'Docker',
      descricao: 'Containerização e Deploy'
    },
  ];
  tarefas = [
    'CRUD Completo de Empresas e Fornecedores',
    'Validação de Documentos (CPF/CNPJ)',
    'Integração com API de CEP',
    'Relacionamento Muitos-para-Muitos',
    'Validações de Negócio'
  ];
}
