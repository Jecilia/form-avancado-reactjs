import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { supabase } from './lib/supabase'
// Scheme é uma representação de estrutura de dados, quais campos, qual é o tipo e por aí fora
const createUserFormSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .transform((list) => list.item(0)!)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'o arquivo precisa ter no máximo 5MB',
    ),
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
      // pesquisar sobre superRefine e o refine(permite crias validações maiores(caso queira que os dados não se repitam ou o que for dependendo das necessidades ))
      return email.endsWith('@rocketseat.com.br')
    }, 'o email precisa ser da rocketseat'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracter'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('o titilo é obrigatório'),
        knowledge: z.coerce.number().min(1).max(100),
      }),
    )
    .min(2, 'insira pelo menos 2 tecnologias'),
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
  const { fields, append } = useFieldArray({
    control,
    name: 'techs',
  })
  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }
  const [output, setOutput] = useState('')
  // async function createUser(data: createUserFormData) {
  function createUser(data: createUserFormData) {
    // JSON.stringify não convert img
    // await supabase.storage
    supabase.storage
      .from('advanced-forms-react')
      .upload(data.avatar.name, data.avatar)
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
          <label htmlFor="avatar">Avatar</label>
          <input type="file" accept="image/*" {...register('avatar')} />
          {errors.avatar && (
            <span className="text-sm text-red-500">
              {errors.avatar.message}
            </span>
          )}
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="name">Nome</label>
          <input
            type="text"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('name')}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
        <div className=" flex flex-col gap-1">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('email')}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className=" flex flex-col gap-1">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            className="h-10 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
            {...register('password')}
          />
          {errors.password && (
            <span className="text-sm text-red-500">
              {errors.password.message}
            </span>
          )}
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
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    className="h-10 flex-1 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
                    {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && (
                    <span className="text-sm text-red-500">
                      {errors.techs?.[index]?.title?.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <input
                    type="number"
                    className=" h-10 w-16 flex-1 rounded border border-zinc-800 bg-zinc-900 px-3 shadow-sm"
                    {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && (
                    <span className="text-sm text-red-500">
                      {errors.techs?.[index]?.knowledge?.message}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {errors.techs && (
            <span className="text-sm text-red-500">{errors.techs.message}</span>
          )}
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
