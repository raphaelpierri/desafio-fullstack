import { Fornecedor } from "./fornecedor.model";

export interface Empresa {
  id: number;
  cnpj: string;
  nomeFantasia: string;
  cep: string;
  fornecedores: Fornecedor[];
  dataCadastro: Date;
  endereco?: {
    logradouro: string;
    bairro: string;
    localidade: string;
    uf: string;
  };
}

export class EmpresaModel implements Empresa {
  constructor(
    public id: number,
    public cnpj: string,
    public nomeFantasia: string,
    public cep: string,
    public fornecedores: Fornecedor[] = [],
    public dataCadastro: Date = new Date(),
    public endereco?: {
      logradouro: string;
      bairro: string;
      localidade: string;
      uf: string;
    }
  ) {
    this.validate();
  }

  private validate(): void {
    if (!/^\d{14}$/.test(this.cnpj)) {
      throw new Error('CNPJ inválido');
    }

    if (!/^\d{8}$/.test(this.cep)) {
      throw new Error('CEP inválido');
    }

    if (this.nomeFantasia.length < 3) {
      throw new Error('Nome fantasia deve ter pelo menos 3 caracteres');
    }
  }
  get cnpjFormatado(): string {
    return this.cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }



  get cepFormatado(): string {
    return this.cep.replace(/(\d{5})(\d{3})/, '$1-$2');
  }
}
