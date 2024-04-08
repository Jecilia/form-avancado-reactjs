import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
// Scheme é uma representação de estrutura de dados, quais campos, qual é o tipo e por aí fora
const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório')
    .transform((name) => {
      return name
        .trim()
        .split(' ') // o espaço é importante dentro do split e join
        .map((word) => {
          return word[0].toLocaleUpperCase().concat(word.substring(1))
        })
        .join(' ')
    }),
  email: z
    .string()
    .nonempty('o email é obrigatório')
    .email('Formato de email inválido')
    .toLowerCase()
    .refine((email) => {
      // pesquisar sobre superRefine
      return email.endsWith('@rocketseat.com.br')
    }, 'o email precisa ser da rocketseat'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracter'),
  techs: z.array(
    z.object({
      title: z.string().nonempty('o titilo é obrigatório'),
      knowledge: z.number().min(1).max(100),
    }),
  ),
})
type createUserFormData = z.infer<typeof createUserFormSchema>
export function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<createUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })
  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }
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
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('name')}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('email')}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('password')}
          />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="" className="flex items-center justify-between">
            Tecnologias
            <button
              type="button"
              onClick={addNewTech}
              className="text-sm text-emerald-500"
            >
              Adicionar
            </button>
          </label>
          {fields.map((field, index) => {
            return (
              <div key={field.id} className="flex gap-2">
                <input
                  type="text"
                  className="h-10 flex-1 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
                  {...register(`techs.${index}.title`)}
                />

                <input
                  type="number"
                  className=" h-10 w-16 flex-1 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
                  {...register(`techs.${index}.knowledge`)}
                />
              </div>
            )
          })}
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
