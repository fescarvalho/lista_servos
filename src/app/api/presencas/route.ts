import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { pessoaId, encontroId, presente } = await request.json();

    if (presente) {
      // Marcar presença
      const presenca = await prisma.presenca.upsert({
        where: {
          pessoaId_encontroId: {
            pessoaId,
            encontroId
          }
        },
        update: { presente: true },
        create: {
          pessoaId,
          encontroId,
          presente: true
        }
      });
      return NextResponse.json(presenca);
    } else {
      // Desmarcar presença (deletar o registro)
      await prisma.presenca.delete({
        where: {
          pessoaId_encontroId: {
            pessoaId,
            encontroId
          }
        }
      }).catch(() => {
        // Ignorar erro se não existir
      });
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    console.error('Erro ao registrar presença:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
