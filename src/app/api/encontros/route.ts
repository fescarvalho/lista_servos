import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const encontros = await prisma.encontro.findMany({
      orderBy: { data: 'desc' },
      include: {
        _count: {
          select: { presencas: true }
        }
      }
    });
    return NextResponse.json(encontros);
  } catch (error) {
    console.error('Erro ao buscar encontros:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const encontro = await prisma.encontro.create({
      data: {
        data: new Date(data.data),
        tema: data.tema,
      },
    });
    return NextResponse.json(encontro, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar encontro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
