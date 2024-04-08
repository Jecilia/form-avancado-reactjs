import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
// Scheme é uma representação de estrutura de dados, quais campos, qual é o tipo e por aí fora
const createUserFormSchema = z.object({
  email: z
    .string()
    .nonempty('o email é obrigatorio')
    .email('Formato de email inválido'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracter'),
})
type createUserFormData = z.infer<typeof createUserFormSchema>
export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })

  const [output, setOutput] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function createUser(data: any) {
    setOutput(JSON.stringify(data, null, 2))
  }
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-10 bg-zinc-950 text-zinc-300">
      <form
        onSubmit={handleSubmit(createUser)}
        action=""
        className="flex w-full max-w-sm flex-col gap-4 px-3"
      >
        <div className=" flex flex-col gap-1">
          <label htmlFor="">E-mail</label>
          <input
            type="email"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="">Senha</label>
          <input
            type="password"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          className="h-10 rounded bg-emerald-500 font-semibold text-white hover:bg-emerald-600"
        >
          Salvar
        </button>
      </form>
      <pre>{output} </pre>
    </main>
  )
}
