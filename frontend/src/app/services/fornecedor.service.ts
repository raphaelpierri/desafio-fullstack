import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Fornecedor } from '../models/fornecedor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {
  private apiUrl = `${environment.apiUrl}/fornecedor`;

  constructor(private http: HttpClient) { }

  findAll(filtros?: any): Observable<Fornecedor[]> {
    console.log(this.apiUrl)
    return this.http.get<Fornecedor[]>(this.apiUrl, { params: filtros });
  }

  findById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.apiUrl}/${id}`);
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

  validarDocumentoExistente(documento: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/validar-documento/${documento}`);
  }
}
