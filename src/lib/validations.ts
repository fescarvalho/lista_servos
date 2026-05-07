import { z } from 'zod'

export const pessoaSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100, 'O nome é muito longo'),
  bairro: z.string().min(2, 'O bairro deve ter pelo menos 2 caracteres').max(50, 'O bairro é muito longo'),
  dataNascimento: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Data de nascimento inválida',
  }).transform((date) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }),
})


export type PessoaInput = z.infer<typeof pessoaSchema>
