interface DeleteConfirmProps {
  clienteName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

export default function DeleteConfirm({ clienteName, onConfirm, onCancel, loading }: DeleteConfirmProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="glass-card p-6 w-full max-w-md animate-scale-in mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Confirmar Exclusão</h3>
          <p className="text-[var(--color-text-muted)] text-sm">
            Tem certeza que deseja excluir o cliente{" "}
            <span className="text-white font-medium">&quot;{clienteName}&quot;</span>?
          </p>
          <p className="text-[var(--color-danger)] text-xs mt-2">
            Esta ação não poderá ser desfeita.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <button onClick={onCancel} className="btn btn-ghost" disabled={loading}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Excluindo...
              </>
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
