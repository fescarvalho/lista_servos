import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const encontros = await prisma.encontro.findMany({
      orderBy: { data: 'asc' },
    });

    const pessoas = await prisma.pessoa.findMany({
      where: { status: 'EM_FORMACAO' },
      include: {
        presencas: true,
      },
      orderBy: { nome: 'asc' },
    });

    // Determine past vs future meetings
    // A meeting is considered "past" if its date is before now, OR if it has at least one presence marked in the database.
    // For simplicity, we can just say "if data <= now" it's past, otherwise future.
    // However, sometimes meetings are created on the same day. Let's just return the raw data and let the frontend compute the frequency if we want, OR we can compute it here.
    // Let's compute it here so the frontend is simpler.

    const now = new Date();
    // Reset time for 'now' to start of day to compare with meeting dates properly
    now.setHours(0, 0, 0, 0);

    const pastEncontros = encontros.filter(e => {
      const eDate = new Date(e.data);
      eDate.setHours(0, 0, 0, 0);
      return eDate.getTime() <= now.getTime();
    });

    const totalPast = pastEncontros.length;

    const formattedPessoas = pessoas.map(pessoa => {
      let presencesInPastMeetings = 0;

      // Count presences only for past meetings
      pastEncontros.forEach(encontro => {
        const hasPresence = pessoa.presencas.some(
          p => p.encontroId === encontro.id && p.presente === true
        );
        if (hasPresence) {
          presencesInPastMeetings++;
        }
      });

      const frequency = totalPast > 0 
        ? Math.round((presencesInPastMeetings / totalPast) * 100) 
        : 100; // If no past meetings, 100% frequency? Or 0. Let's say 0 if totalPast is 0.
      
      const adjustedFrequency = totalPast > 0 ? frequency : 0;

      // Map presences for easier frontend consumption
      const presencasMap: Record<string, boolean> = {};
      pessoa.presencas.forEach(p => {
        presencasMap[p.encontroId] = p.presente;
      });

      return {
        id: pessoa.id,
        nome: pessoa.nome,
        status: pessoa.status,
        frequencia: adjustedFrequency,
        presencasMap,
      };
    });

    return NextResponse.json({
      encontros,
      pessoas: formattedPessoas,
    });
  } catch (error) {
    console.error('Error fetching servos data:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados dos servos' },
      { status: 500 }
    );
  }
}
