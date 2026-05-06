import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { pessoaSchema } from '@/lib/validations'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the data
    const result = pessoaSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const { nome, dataNascimento } = result.data

    // Save to database
    const novaPessoa = await prisma.pessoa.create({
      data: {
        nome,
        dataNascimento,
      },
    })

    return NextResponse.json(novaPessoa, { status: 201 })
  } catch (error) {
    console.error('Error creating pessoa:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor ao salvar os dados' },
      { status: 500 }
    )
  }
}
