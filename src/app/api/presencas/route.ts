import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { pessoaId, encontroId, status } = await request.json(); // status: 'PRESENTE' | 'FALTA' | 'JUSTIFICADA'

    if (status === 'PRESENTE') {
      // Marcar presença
      const presenca = await prisma.presenca.upsert({
        where: {
          pessoaId_encontroId: {
            pessoaId,
            encontroId
          }
        },
        update: { presente: true, justificada: false },
        create: {
          pessoaId,
          encontroId,
          presente: true,
          justificada: false
        }
      });
      return NextResponse.json(presenca);
    } else if (status === 'JUSTIFICADA') {
      // Marcar falta justificada
      const presenca = await prisma.presenca.upsert({
        where: {
          pessoaId_encontroId: {
            pessoaId,
            encontroId
          }
        },
        update: { presente: false, justificada: true },
        create: {
          pessoaId,
          encontroId,
          presente: false,
          justificada: true
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
