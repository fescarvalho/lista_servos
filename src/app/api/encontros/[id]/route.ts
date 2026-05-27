import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const encontro = await prisma.encontro.findUnique({
      where: { id },
      include: {
        presencas: true
      }
    });

    if (!encontro) {
      return NextResponse.json({ error: 'Encontro não encontrado' }, { status: 404 });
    }

    // Buscar também todas as pessoas que estão em formação para montar a lista completa de presença
    const pessoas = await prisma.pessoa.findMany({
      where: {
        status: 'EM_FORMACAO'
      },
      orderBy: { nome: 'asc' }
    });

    return NextResponse.json({ encontro, pessoas });
  } catch (error) {
    console.error('Erro ao buscar encontro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
