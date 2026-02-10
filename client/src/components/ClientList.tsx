import type { Cliente } from "../types/client";

interface ClienteListProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}

function formatCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

export default function ClientList({ clientes, loading, onEdit, onDelete }: ClienteListProps) {
  if (loading) {
    return (
      <div className="glass-card p-8 sm:p-12 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[var(--color-text-muted)]">Carregando clientes...</p>
      </div>
    );
  }

  if (clientes.length === 0) {
    return (
      <div className="glass-card p-8 sm:p-12 text-center animate-fade-in">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-white mb-2">Nenhum cliente cadastrado</h3>
        <p className="text-[var(--color-text-muted)] text-sm">
          Clique em &quot;Novo Cliente&quot; para começar.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Mobile: Card layout */}
      <div className="sm:hidden space-y-3">
        {clientes.map((cliente, index) => (
          <div
            key={cliente.id}
            className="glass-card p-4"
            style={{ animationDelay: `${index * 50}ms`, animation: "fadeIn 0.3s ease-out forwards", opacity: 0 }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm truncate">{cliente.nome}</p>
                <p className="font-mono text-xs text-[var(--color-primary-light)] mt-0.5">
                  {formatCnpj(cliente.cnpj)}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => onEdit(cliente)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] transition-all"
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => onDelete(cliente)}
                  className="p-1.5 rounded-lg hover:bg-[var(--color-danger)]/15 text-[var(--color-danger)] transition-all"
                  title="Excluir"
                >
                  🗑️
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--color-text-muted)]">
              {cliente.nomeFantasia && (
                <span className="truncate max-w-full">{cliente.nomeFantasia}</span>
              )}
              {cliente.cidade && cliente.uf && (
                <span>📍 {cliente.cidade}/{cliente.uf}</span>
              )}
              {cliente.telefone && (
                <span>📞 {cliente.telefone}</span>
              )}
            </div>
          </div>
        ))}
        <div className="text-center text-xs text-[var(--color-text-muted)] py-2">
          {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} cadastrado{clientes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Desktop: Table layout */}
      <div className="glass-card overflow-hidden hidden sm:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">CNPJ</th>
                <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium">Nome</th>
                <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium hidden md:table-cell">Nome Fantasia</th>
                <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium hidden lg:table-cell">Cidade/UF</th>
                <th className="text-left px-4 py-3 text-[var(--color-text-muted)] font-medium hidden lg:table-cell">Telefone</th>
                <th className="text-right px-4 py-3 text-[var(--color-text-muted)] font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente, index) => (
                <tr
                  key={cliente.id}
                  className="table-row border-b border-[var(--color-border)]/30"
                  style={{ animationDelay: `${index * 50}ms`, animation: "fadeIn 0.3s ease-out forwards", opacity: 0 }}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-primary-light)]">
                    {formatCnpj(cliente.cnpj)}
                  </td>
                  <td className="px-4 py-3 text-white font-medium max-w-[200px] truncate">
                    {cliente.nome}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden md:table-cell max-w-[150px] truncate">
                    {cliente.nomeFantasia || "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">
                    {cliente.cidade && cliente.uf
                      ? `${cliente.cidade}/${cliente.uf}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-text-muted)] hidden lg:table-cell">
                    {cliente.telefone || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(cliente)}
                        className="p-2 rounded-lg hover:bg-[var(--color-primary)]/15 text-[var(--color-primary-light)] transition-all hover:scale-110"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(cliente)}
                        className="p-2 rounded-lg hover:bg-[var(--color-danger)]/15 text-[var(--color-danger)] transition-all hover:scale-110"
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-[var(--color-border)]/30 text-xs text-[var(--color-text-muted)]">
          {clientes.length} cliente{clientes.length !== 1 ? "s" : ""} cadastrado{clientes.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
