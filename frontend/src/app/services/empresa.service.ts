import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../models/empresa.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private apiUrl = `${environment.apiUrl}/empresas`;

  constructor(private http: HttpClient) { }

  findAll(filtros?: any): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl, { params: filtros });
  }

  findById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  create(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }

  updateById(id: number, empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.apiUrl}/${id}`, empresa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  validarCnpjExistente(cnpj: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validar-cnpj/${cnpj}`);
  }

  getFornecedores(idEmpresa: string): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(`${this.apiUrl}/${idEmpresa}/fornecedores`);
  }

  addFornecedor(idEmpresa: string, idFornecedor: string): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${idEmpresa}/fornecedores/${idFornecedor}`,
      {}
    );
  }

  removeFornecedor(idEmpresa: string, idFornecedor: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${idEmpresa}/fornecedores/${idFornecedor}`
    );
  }
}
