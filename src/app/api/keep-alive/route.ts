import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Validação opcional de segurança para evitar acessos indesejados
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fazendo uma consulta super leve no banco de dados
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({ 
      success: true, 
      message: 'O banco de dados do Supabase foi mantido ativo.' 
    });
  } catch (error) {
    console.error('Erro no keep-alive:', error);
    return NextResponse.json({ error: 'Falha ao conectar no banco' }, { status: 500 });
  }
}
