import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PesquisarEmpresaComponent } from './components/empresa/pesquisar-empresa/pesquisar-empresa.component';
import { PesquisarFornecedorComponent } from './components/fornecedor/pesquisar-fornecedor/pesquisar-fornecedor.component';
import { CadastrarEmpresaComponent } from './components/empresa/cadastrar-empresa/cadastrar-empresa.component';
import { EditarEmpresaComponent } from './components/empresa/editar-empresa/editar-empresa.component';
import { CadastrarFornecedorComponent } from './components/fornecedor/cadastrar-fornecedor/cadastrar-fornecedor.component';
import { EditarFornecedorComponent } from './components/fornecedor/editar-fornecedor/editar-fornecedor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'empresas', component: PesquisarEmpresaComponent },
  { path: 'empresas/cadastrar', component: CadastrarEmpresaComponent },
  { path: 'empresas/editar/:id', component: EditarEmpresaComponent },
  { path: 'fornecedores', component: PesquisarFornecedorComponent },
  { path: 'fornecedores/cadastrar', component: CadastrarFornecedorComponent },
  { path: 'fornecedores/editar/:id', component: EditarFornecedorComponent },
];
