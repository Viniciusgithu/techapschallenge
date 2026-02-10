import { useCallback, useEffect, useState } from "react";
import ClienteForm from "./components/ClientForm";
import ClienteList from "./components/ClientList";
import DeleteConfirm from "./components/DeleteConfirm";
import Header from "./components/Header";
import { createCliente, deleteCliente, getClientes, updateCliente } from "./services/api";
import type { Cliente, ClienteFormData } from "./types/client";

type ToastType = "success" | "error";
interface Toast {
  message: string;
  type: ToastType;
}

export default function App() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const loadClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data);
    } catch {
      showToast("Erro ao carregar clientes", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  function handleNewCliente() {
    setEditingCliente(null);
    setShowForm(true);
  }

  function handleEdit(cliente: Cliente) {
    setEditingCliente(cliente);
    setShowForm(true);
  }

  function handleDeleteRequest(cliente: Cliente) {
    setDeletingCliente(cliente);
  }

  async function handleSave(data: ClienteFormData, id?: number) {
    try {
      if (id) {
        await updateCliente(id, data);
        showToast("Cliente atualizado com sucesso!", "success");
      } else {
        await createCliente(data);
        showToast("Cliente cadastrado com sucesso!", "success");
      }
      setShowForm(false);
      setEditingCliente(null);
      await loadClientes();
    } catch (err: any) {
      const msg = err?.response?.data?.error;
      if (typeof msg === "string") {
        showToast(msg, "error");
      } else {
        showToast("Erro ao salvar cliente", "error");
      }
      throw err;
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingCliente) return;
    setDeleteLoading(true);
    try {
      await deleteCliente(deletingCliente.id);
      showToast("Cliente excluído com sucesso!", "success");
      setDeletingCliente(null);
      await loadClientes();
    } catch {
      showToast("Erro ao excluir cliente", "error");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-8">
      <section className="max-w-6xl mx-auto">
        {/* Header */}
        <Header handleNewCliente={handleNewCliente} />

        {/* Client List */}
        <ClienteList
          clientes={clientes}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />

        {/* Form Modal */}
        {showForm && (
          <ClienteForm
            cliente={editingCliente}
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingCliente(null);
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deletingCliente && (
          <DeleteConfirm
            clienteName={deletingCliente.nome}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setDeletingCliente(null)}
            loading={deleteLoading}
          />
        )}

        {/* Toast */}
        {toast && (
          <div className={`toast ${toast.type === "success" ? "toast-success" : "toast-error"}`}>
            {toast.type === "success" ? "✅" : "❌"} {toast.message}
          </div>
        )}
      </section>
    </main>
  );
}
