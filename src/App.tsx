export function App() {
  return (
    <main className="flex h-screen items-center justify-center bg-zinc-50">
      <form action="" className="flex w-full max-w-sm flex-col gap-4 px-3">
        <div className=" flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            name="email"
            className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
          />
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            name="password"
            className="h-10 rounded border border-zinc-200 px-3 shadow-sm"
          />
        </div>
        <button
          type="submit"
          className="h-10 rounded bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
    </main>
  )
}
