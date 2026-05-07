import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { pessoaSchema } from '@/lib/validations'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.pessoa.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Registro excluído com sucesso' })
  } catch (error) {
    console.error('Error deleting pessoa:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir o registro' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate the data
    const result = pessoaSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: result.error.format() },
        { status: 400 }
      )
    }

    const { nome, bairro, dataNascimento } = result.data

    const updatedPessoa = await prisma.pessoa.update({
      where: { id },
      data: {
        nome,
        bairro,
        dataNascimento,
      },
    })

    return NextResponse.json(updatedPessoa)
  } catch (error) {
    console.error('Error updating pessoa:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar o registro' },
      { status: 500 }
    )
  }
}
