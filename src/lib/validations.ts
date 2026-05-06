import { z } from 'zod'

export const pessoaSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100, 'O nome é muito longo'),
  dataNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida',
  }).transform((date) => new Date(date)),
})

export type PessoaInput = z.infer<typeof pessoaSchema>
