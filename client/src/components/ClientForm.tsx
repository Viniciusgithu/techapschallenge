import { useEffect, useState } from "react";
import type { ZodError } from "zod";
import { clienteSchema } from "../schemas/cliente";
import { fetchCepData, fetchCnpjData } from "../services/api";
import type { Cliente, ClienteFormData } from "../types/client";

interface ClienteFormProps {
  cliente: Cliente | null;
  onSave: (data: ClienteFormData, id?: number) => Promise<void>;
  onCancel: () => void;
}

const emptyForm: ClienteFormData = {
  cnpj: "",
  nome: "",
  nomeFantasia: "",
  cep: "",
  logradouro: "",
  bairro: "",
  cidade: "",
  uf: "",
  complemento: "",
  email: "",
  telefone: "",
};

export default function ClienteForm({ cliente, onSave, onCancel }: ClienteFormProps) {
  const [form, setForm] = useState<ClienteFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const isEditing = cliente !== null;

  useEffect(() => {
    if (cliente) {
      setForm({
        cnpj: cliente.cnpj,
        nome: cliente.nome,
        nomeFantasia: cliente.nomeFantasia ?? "",
        cep: cliente.cep ?? "",
        logradouro: cliente.logradouro ?? "",
        bairro: cliente.bairro ?? "",
        cidade: cliente.cidade ?? "",
        uf: cliente.uf ?? "",
        complemento: cliente.complemento ?? "",
        email: cliente.email ?? "",
        telefone: cliente.telefone ?? "",
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [cliente]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  }

  async function handleCnpjBlur() {
    const cnpj = form.cnpj.replace(/\D/g, "");
    if (cnpj.length !== 14) return;

    setCnpjLoading(true);
    const data = await fetchCnpjData(cnpj);
    setCnpjLoading(false);

    if (data) {
      setForm((prev) => ({
        ...prev,
        nome: data.razao_social || prev.nome,
        nomeFantasia: data.nome_fantasia || prev.nomeFantasia,
        logradouro: data.logradouro ? data.logradouro.substring(0, 10) : prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.municipio || prev.cidade,
        uf: data.uf || prev.uf,
        cep: data.cep?.replace(/\D/g, "") || prev.cep,
        complemento: data.complemento || prev.complemento,
        email: data.email || prev.email,
        telefone: data.ddd_telefone_1?.replace(/\D/g, "") || prev.telefone,
      }));
    }
  }

  async function handleCepBlur() {
    const cep = form.cep?.replace(/\D/g, "") || "";
    if (cep.length !== 8) return;

    setCepLoading(true);
    const data = await fetchCepData(cep);
    setCepLoading(false);

    if (data) {
      setForm((prev) => ({
        ...prev,
        logradouro: data.logradouro ? data.logradouro.substring(0, 10) : prev.logradouro,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        uf: data.uf || prev.uf,
        complemento: data.complemento || prev.complemento,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = clienteSchema.safeParse(form);
    if (!result.success) {
      const zodError = result.error as ZodError;
      const fieldErrors: Record<string, string> = {};
      zodError.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await onSave(form, cliente?.id);
    } catch {
      // Error handled by parent
    } finally {
      setLoading(false);
    }
  }

  const fields: { name: keyof ClienteFormData; label: string; placeholder: string; onBlur?: () => void; loadingState?: boolean; maxLength?: number }[] = [
    { name: "cnpj", label: "CNPJ", placeholder: "00000000000000", onBlur: handleCnpjBlur, loadingState: cnpjLoading, maxLength: 14 },
    { name: "nome", label: "Nome / Razão Social", placeholder: "Nome da empresa", maxLength: 100 },
    { name: "nomeFantasia", label: "Nome Fantasia", placeholder: "Nome fantasia", maxLength: 100 },
    { name: "email", label: "Email", placeholder: "empresa@email.com", maxLength: 100 },
    { name: "telefone", label: "Telefone", placeholder: "11999999999", maxLength: 15 },
    { name: "cep", label: "CEP", placeholder: "01001000", onBlur: handleCepBlur, loadingState: cepLoading, maxLength: 10 },
    { name: "logradouro", label: "Logradouro", placeholder: "Rua/Av", maxLength: 10 },
    { name: "bairro", label: "Bairro", placeholder: "Bairro", maxLength: 100 },
    { name: "cidade", label: "Cidade", placeholder: "São Paulo", maxLength: 100 },
    { name: "uf", label: "UF", placeholder: "SP", maxLength: 2 },
    { name: "complemento", label: "Complemento", placeholder: "Sala 101", maxLength: 100 },
  ];

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="glass-card p-4 sm:p-6 w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto animate-scale-in mx-2 sm:mx-4 rounded-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-xl font-semibold text-white">
            {isEditing ? "✏️ Editar Cliente" : "➕ Novo Cliente"}
          </h2>
          <button onClick={onCancel} className="text-[var(--color-text-muted)] hover:text-white transition-colors text-lg sm:text-xl p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {fields.map(({ name, label, placeholder, onBlur, loadingState, maxLength }) => (
              <div key={name} className={name === "nome" || name === "nomeFantasia" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-[var(--color-text-muted)] mb-1.5">
                  {label}
                  {(name === "cnpj" || name === "nome") && <span className="text-[var(--color-danger)] ml-1">*</span>}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name={name}
                    value={(form[name] as string) || ""}
                    onChange={handleChange}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    maxLength={maxLength}
                    className={`form-input ${errors[name] ? "error" : ""}`}
                    disabled={isEditing && name === "cnpj"}
                  />
                  {loadingState && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                {errors[name] && (
                  <p className="text-[var(--color-danger)] text-xs mt-1 animate-fade-in">{errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-[var(--color-border)]">
            <button type="button" onClick={onCancel} className="btn btn-ghost w-full sm:w-auto">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary w-full sm:w-auto">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </>
              ) : isEditing ? "Atualizar" : "Cadastrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
