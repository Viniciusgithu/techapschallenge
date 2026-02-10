import { z } from "zod";

/**
 * Validates CNPJ check digits using the official algorithm.
 */
function isValidCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calc = (digits: string, weights: number[]): number => {
    const sum = weights.reduce((acc, w, i) => acc + parseInt(digits[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const digit1 = calc(cnpj, weights1);
  const digit2 = calc(cnpj, weights2);

  return parseInt(cnpj[12]) === digit1 && parseInt(cnpj[13]) === digit2;
}

// Helper: treat empty strings as undefined so optional validation works correctly
const optionalString = (schema: z.ZodString) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema.optional());

export const clienteSchema = z.object({
  cnpj: z
    .string()
    .min(1, "CNPJ é obrigatório")
    .length(14, "CNPJ deve ter 14 dígitos")
    .regex(/^\d{14}$/, "CNPJ deve conter apenas números")
    .refine(isValidCnpj, "CNPJ inválido (dígito verificador incorreto)"),
  nome: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  nomeFantasia: optionalString(z.string().max(100, "Nome fantasia deve ter no máximo 100 caracteres")),
  cep: optionalString(
    z.string()
      .regex(/^\d+$/, "CEP deve conter apenas números")
      .length(8, "CEP deve ter 8 dígitos")
  ),
  logradouro: optionalString(z.string().max(10, "Logradouro deve ter no máximo 10 caracteres")),
  bairro: optionalString(z.string().max(100, "Bairro deve ter no máximo 100 caracteres")),
  cidade: optionalString(z.string().max(100, "Cidade deve ter no máximo 100 caracteres")),
  uf: optionalString(
    z.string()
      .length(2, "UF deve ter 2 caracteres")
      .regex(/^[A-Z]{2}$/, "UF deve conter 2 letras maiúsculas (ex: SP)")
  ),
  complemento: optionalString(z.string().max(100, "Complemento deve ter no máximo 100 caracteres")),
  email: optionalString(
    z.string()
      .email("Email inválido")
      .max(100, "Email deve ter no máximo 100 caracteres")
  ),
  telefone: optionalString(
    z.string()
      .regex(/^\d+$/, "Telefone deve conter apenas números")
      .min(10, "Telefone deve ter no mínimo 10 dígitos")
      .max(15, "Telefone deve ter no máximo 15 dígitos")
  ),
});

export type ClienteSchemaType = z.infer<typeof clienteSchema>;
