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

    const { nome, bairro, dataNascimento, status } = result.data

    // Save to database
    const novaPessoa = await prisma.pessoa.create({
      data: {
        nome: nome,
        bairro: bairro,
        dataNascimento: dataNascimento,
        status: status,
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

export async function GET(request: Request) {
  try {
    // Audit: Protection against unauthorized access
    const authHeader = request.headers.get('x-admin-password');
    if (authHeader !== 'adminservos') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const totalEncontros = await prisma.encontro.count();
    
    const pessoas = await prisma.pessoa.findMany({
      orderBy: {
        nome: 'asc',
      },
      include: {
        _count: {
          select: { presencas: true }
        }
      }
    })

    const pessoasComPresenca = pessoas.map(p => ({
      ...p,
      porcentagemPresenca: totalEncontros === 0 ? 0 : Math.round((p._count.presencas / totalEncontros) * 100),
      totalPresencas: p._count.presencas,
      totalEncontros
    }));

    return NextResponse.json(pessoasComPresenca)
  } catch (error) {
    console.error('Error fetching pessoas:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar dados' },
      { status: 500 }
    )
  }
}

