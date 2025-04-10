import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Fornecedor, TipoPessoa } from '../models/fornecedor.model';
import { environment } from '../../environments/environment';

// Tipo vindo do backend (com 'documento')
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
    const payload = this.mapFornecedorToBackend(fornecedor);
    return this.http.post<Fornecedor>(this.apiUrl, payload);
  }

  updateById(id: number, fornecedor: Fornecedor): Observable<Fornecedor> {
    const payload = this.mapFornecedorToBackend(fornecedor);
    return this.http.put<Fornecedor>(`${this.apiUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validarDocumentoExistente(documento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validar-documento/${documento}`);
  }

  // 🔁 Adaptador para envio
  private mapFornecedorToBackend(f: Fornecedor): any {
    return {
      ...f,
      documento: f.tipoPessoa === TipoPessoa.FISICA ? f.cpf : f.cnpj
    };
  }
}
