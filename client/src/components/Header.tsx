
interface HeaderProps {
    handleNewCliente: () => void;
}

export default function Header({ handleNewCliente }: HeaderProps) {
    return (
        <header className="mb-5 sm:mb-8 animate-slide-up glass-card p-4">
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4" >
            <div className="">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-4xl">🏢</span>
                <span className="bg-gradient-to-r from-[var(--color-primary-light)] to-[var(--color-primary)] bg-clip-text text-transparent">
                  Gestão de Clientes
                </span>
              </h1>
              <p className="text-[var(--color-text-muted)] mt-1 text-xs sm:text-sm">
                Cadastro e gerenciamento de clientes — Desafio APS
              </p>
            </div>
            <button onClick={handleNewCliente} className="btn btn-primary text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3 w-full sm:w-auto">
              <span className="text-lg">+</span>
              Novo Cliente
            </button>
          </section>
        </header>
    )
}


