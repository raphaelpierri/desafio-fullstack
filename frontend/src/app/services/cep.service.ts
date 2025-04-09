// src/app/services/cep.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Endereco {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {


  constructor(private http: HttpClient) { }

  buscarEndereco(cep: string): Observable<Endereco | null> {
    return this.http.get(`/viacep/ws/${cep}/json`).pipe(
      map((response: any) => ({
        cep: response.cep,
        logradouro: response.logradouro,
        bairro: response.bairro,
        localidade: response.localidade,
        uf: response.uf
      }))
    );
  }

  validarFormatoCEP(cep: string): boolean {
    return /^[0-9]{8}$/.test(cep);
  }
}
