import { Empresa } from "./empresa.model";

export enum TipoPessoa {
  FISICA = 'Física',
  JURIDICA = 'Jurídica'
}

export interface Fornecedor {
  id: number;
  tipoPessoa: TipoPessoa;
  documento?: string;
  cpf?: string;
  cnpj?: string;
  nome: string;
  email: string;
  cep: string;
  rg?: string;
  dataNascimento?: Date;
  empresas: Empresa[];
}

export class FornecedorModel implements Fornecedor {
  constructor(
    public id: number,
    public tipoPessoa: TipoPessoa,
    public documento: string,
    public nome: string,
    public email: string,
    public cep: string,
    public empresas: Empresa[] = [],
    public cpf?: string,
    public cnpj?: string,
    public rg?: string,
    public dataNascimento?: Date
  ) {
    this.validate();
  }

  private validate(): void {
    if (this.tipoPessoa === TipoPessoa.FISICA) {
      if (!this.cpf) throw new Error('CPF é obrigatório para pessoa física');
      if (!this.rg) throw new Error('RG é obrigatório para pessoa física');
      if (!this.dataNascimento) throw new Error('Data de nascimento é obrigatória');
      this.validateCpf(this.cpf);
    }

    if (this.tipoPessoa === TipoPessoa.JURIDICA && !this.cnpj) {
      throw new Error('CNPJ é obrigatório para pessoa jurídica');
    }

    this.validateCep(this.cep);
  }

  private validateCpf(cpf: string): void {
    if (!/^\d{11}$/.test(cpf)) {
      throw new Error('CPF inválido');
    }
  }

  private validateCep(cep: string): void {
    if (!/^\d{8}$/.test(cep)) {
      throw new Error('CEP inválido');
    }
  }

  get idade(): number | null {
    if (!this.dataNascimento) return null;
    const diff = Date.now() - new Date(this.dataNascimento).getTime();
    return Math.abs(new Date(diff).getUTCFullYear() - 1970);
  }
}
