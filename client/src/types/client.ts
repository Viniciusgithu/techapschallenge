export interface Cliente {
  id: number;
  cnpj: string;
  nome: string;
  nomeFantasia: string | null;
  cep: string | null;
  logradouro: string | null;
  bairro: string | null;
  cidade: string | null;
  uf: string | null;
  complemento: string | null;
  email: string | null;
  telefone: string | null;
}

export type ClienteFormData = Omit<Cliente, "id">;

export interface CnpjApiResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  email: string | null;
  ddd_telefone_1: string;
  descricao_situacao_cadastral: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}
