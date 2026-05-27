'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

type Pessoa = {
  id: string;
  nome: string;
};

type Presenca = {
  id: string;
  pessoaId: string;
  encontroId: string;
};

export default function EncontroDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const [encontro, setEncontro] = useState<any>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [presencas, setPresencas] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/encontros/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEncontro(data.encontro);
          setPessoas(data.pessoas);
          
          const presencasSet = new Set<string>();
          data.encontro.presencas.forEach((p: Presenca) => presencasSet.add(p.pessoaId));
          setPresencas(presencasSet);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const togglePresenca = async (pessoaId: string) => {
    const isPresente = presencas.has(pessoaId);
    
    // Optimistic UI update
    const newPresencas = new Set(presencas);
    if (isPresente) {
      newPresencas.delete(pessoaId);
    } else {
      newPresencas.add(pessoaId);
    }
    setPresencas(newPresencas);

    try {
      await fetch('/api/presencas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pessoaId,
          encontroId: id,
          presente: !isPresente
        }),
      });
    } catch (err) {
      console.error(err);
      // Revert on error could be implemented here
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!encontro) return <div className="p-8 text-center text-red-500">Encontro não encontrado.</div>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto p-4 space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{encontro.tema || 'Encontro'}</h1>
            <p className="text-slate-500 font-medium">
              {new Date(encontro.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
            </p>
          </div>
          <Link href="/encontros" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">Voltar</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Lista de Presença</h2>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-4 py-1 rounded-full">
              {presencas.size} / {pessoas.length} presentes
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {pessoas.map(pessoa => {
              const isPresente = presencas.has(pessoa.id);
              return (
                <div key={pessoa.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <span className="font-semibold text-slate-800">{pessoa.nome}</span>
                  <button
                    onClick={() => togglePresenca(pessoa.id)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${
                      isPresente 
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 shadow-sm' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {isPresente ? 'Presente' : 'Ausente'}
                  </button>
                </div>
              );
            })}
            {pessoas.length === 0 && (
              <div className="p-12 text-center text-slate-500 italic">
                Nenhuma pessoa cadastrada no sistema.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
