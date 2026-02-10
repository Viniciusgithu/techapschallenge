import { z } from "zod";

/**
 * Validates a CNPJ check digit.
 * Brazilian CNPJ format: 14 numeric digits, last 2 are check digits.
 */
function isValidCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false; // all same digits

  const calc = (digits: string, weights: number[]): number => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calc(cnpj, weights1);
  const digit2 = calc(cnpj, weights2);

  return (
    parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2
  );
}

// Validates the client creation schema
export const clienteCreateSchema = z.object({
  cnpj: z
    .string()
    .length(14, "CNPJ deve ter 14 dígitos")
    .regex(/^\d{14}$/, "CNPJ deve conter apenas números")
    .refine(isValidCnpj, "CNPJ inválido (dígito verificador incorreto)"),
  nome: z.string().min(1, "Nome é obrigatório").max(100),
  nomeFantasia: z.string().min(1, "Nome fantasia é obrigatório").max(100).optional().nullable(),
  cep: z.string().min(1, "CEP é obrigatório").max(10).optional().nullable(),
  logradouro: z.string().min(1, "Logradouro é obrigatório").max(10).optional().nullable(),
  bairro: z.string().min(1, "Bairro é obrigatório").max(100).optional().nullable(),
  cidade: z.string().min(1, "Cidade é obrigatória").max(100).optional().nullable(),
  uf: z.string().min(1, "UF é obrigatória").max(2).optional().nullable(),
  complemento: z.string().min(1, "Complemento é obrigatório").max(100).optional().nullable(),
  email: z.string().email("Email inválido").max(100).optional().nullable(),
  telefone: z.string().min(1, "Telefone é obrigatório").max(15).optional().nullable(),
});

// Validates the client update schema
export const clienteUpdateSchema = clienteCreateSchema.partial();

// Validates the client ID parameter
export const idParamSchema = z.object({
  id: z.coerce.number().int().positive("ID deve ser um número positivo"),
});

// Types for the client schema
export type ClienteCreateInput = z.infer<typeof clienteCreateSchema>;
export type ClienteUpdateInput = z.infer<typeof clienteUpdateSchema>;
