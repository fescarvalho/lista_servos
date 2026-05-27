'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Encontro = {
  id: string;
  data: string;
  tema: string | null;
  _count?: { presencas: number };
};

export default function EncontrosPage() {
  const [encontros, setEncontros] = useState<Encontro[]>([]);
  const [data, setData] = useState('');
  const [tema, setTema] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEncontros = async () => {
    try {
      const res = await fetch('/api/encontros');
      if (res.ok) {
        const data = await res.json();
        setEncontros(data);
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || 'Erro ao buscar encontros. Tente reiniciar o servidor.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de conexão ao buscar encontros.');
    }
  };

  useEffect(() => {
    fetchEncontros();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/encontros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, tema }),
      });
      if (res.ok) {
        setData('');
        setTema('');
        fetchEncontros();
      } else {
        const errData = await res.json().catch(() => ({}));
        setErrorMsg(errData.error || 'Erro ao criar encontro. (O servidor precisa ser reiniciado?)');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro de conexão ao criar encontro.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto p-4 space-y-8 pt-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">Encontros</h1>
          <Link href="/lista" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline">Voltar para Painel</Link>
        </div>

        {errorMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Aviso: </strong>
            <span className="block sm:inline">{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleCreate} className="bg-white p-6 rounded-2xl shadow-md border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold text-slate-800">Novo Encontro</h2>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
              <input
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Tema (Opcional)</label>
              <input
                type="text"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: Reunião de Planejamento"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors h-[50px]"
            >
              {loading ? 'Criando...' : 'Criar Encontro'}
            </button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {encontros.map(encontro => (
            <Link
              key={encontro.id}
              href={`/encontros/${encontro.id}`}
              className="block bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-200"
            >
              <div className="text-slate-500 text-sm mb-2 font-medium">
                {new Date(encontro.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{encontro.tema || 'Sem tema'}</h3>
              <div className="text-sm text-indigo-600 font-bold bg-indigo-50 w-fit px-3 py-1 rounded-full">
                {encontro._count?.presencas || 0} presenças
              </div>
            </Link>
          ))}
          {encontros.length === 0 && (
            <div className="col-span-full text-center text-slate-500 py-8 bg-white rounded-2xl border border-slate-100">
              Nenhum encontro registrado ainda.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
