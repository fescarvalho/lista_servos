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

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const encontroAtualizado = await prisma.encontro.update({
      where: { id },
      data: {
        data: data.data ? new Date(data.data) : undefined,
        tema: data.tema,
      }
    });

    return NextResponse.json(encontroAtualizado);
  } catch (error) {
    console.error('Erro ao atualizar encontro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.encontro.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar encontro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
