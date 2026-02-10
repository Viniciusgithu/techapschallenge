import axios from "axios";
import type { Cliente, ClienteFormData, CnpjApiResponse, ViaCepResponse } from "../types/client";

const api = axios.create({
  baseURL: "/api",
});

// ─── CRUD Operations ───

export async function getClientes(): Promise<Cliente[]> {
  const { data } = await api.get<Cliente[]>("/clientes");
  return data;
}

export async function createCliente(cliente: ClienteFormData): Promise<Cliente> {
  const { data } = await api.post<Cliente>("/clientes", cliente);
  return data;
}

export async function updateCliente(id: number, cliente: Partial<ClienteFormData>): Promise<Cliente> {
  const { data } = await api.put<Cliente>(`/clientes/${id}`, cliente);
  return data;
}

export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`/clientes/${id}`);
}

// ─── External APIs ───

// API BrasilAPI for CNPJ data

export async function fetchCnpjData(cnpj: string): Promise<CnpjApiResponse | null> {
  try {
    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) return null;
    const { data } = await axios.get<CnpjApiResponse>(
      `https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`
    );
    return data;
  } catch {
    return null;
  }
}

// API ViaCEP for CEP data

export async function fetchCepData(cep: string): Promise<ViaCepResponse | null> {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;
    const { data } = await axios.get<ViaCepResponse>(
      `https://viacep.com.br/ws/${cleanCep}/json/`
    );
    if (data.erro) return null;
    return data;
  } catch {
    return null;
  }
}
