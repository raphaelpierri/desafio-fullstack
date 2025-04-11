import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Fornecedor, TipoPessoa } from '../models/fornecedor.model';
import { environment } from '../../environments/environment';

interface FornecedorBackend {
  id: number;
  tipoPessoa: TipoPessoa;
  documento: string;
  nome: string;
  email: string;
  cep: string;
  rg?: string;
  dataNascimento?: Date;
  empresas: any[];
}

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/fornecedor`;

  constructor(private http: HttpClient) {}

  private mapFornecedorFromBackend(f: FornecedorBackend): Fornecedor {
    return {
      id: f.id,
      tipoPessoa: f.tipoPessoa,
      nome: f.nome,
      email: f.email,
      cep: f.cep,
      rg: f.rg,
      dataNascimento: f.dataNascimento,
      empresas: f.empresas,
      ...(f.tipoPessoa === TipoPessoa.FISICA
        ? { cpf: f.documento }
        : { cnpj: f.documento })
    };
  }

  findAll(filtros?: any): Observable<Fornecedor[]> {
    return this.http.get<FornecedorBackend[]>(this.apiUrl, { params: filtros }).pipe(
      map(res => res.map(this.mapFornecedorFromBackend))
    );
  }

  findById(id: number): Observable<Fornecedor> {
    return this.http.get<FornecedorBackend>(`${this.apiUrl}/${id}`).pipe(
      map(this.mapFornecedorFromBackend)
    );
  }

  create(fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.apiUrl, fornecedor);
  }

  updateById(id: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, fornecedor);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  calcularIdade(dataNascimento: Date): number {
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();

    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
      idade--;
    }

    return idade;
  }


}
