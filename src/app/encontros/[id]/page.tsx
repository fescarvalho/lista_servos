'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Pessoa = {
  id: string;
  nome: string;
};

type Presenca = {
  id: string;
  pessoaId: string;
  encontroId: string;
  presente: boolean;
  justificada: boolean;
};

export default function EncontroDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const router = useRouter();
  const [encontro, setEncontro] = useState<any>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [presencas, setPresencas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editTema, setEditTema] = useState('');
  const [editData, setEditData] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/encontros/${id}`);
        if (res.ok) {
          const data = await res.json();
          setEncontro(data.encontro);
          setPessoas(data.pessoas);
          
          setEditTema(data.encontro.tema || '');
          if (data.encontro.data) {
            setEditData(new Date(data.encontro.data).toISOString().split('T')[0]);
          }
          
          const presencasMap: Record<string, string> = {};
          data.encontro.presencas.forEach((p: Presenca) => {
            if (p.presente) presencasMap[p.pessoaId] = 'PRESENTE';
            else if (p.justificada) presencasMap[p.pessoaId] = 'JUSTIFICADA';
            else presencasMap[p.pessoaId] = 'FALTA';
          });
          setPresencas(presencasMap);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const setPresencaStatus = async (pessoaId: string, status: string) => {
    // Optimistic UI update
    setPresencas(prev => ({
      ...prev,
      [pessoaId]: status
    }));

    try {
      await fetch('/api/presencas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pessoaId,
          encontroId: id,
          status
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este encontro? Todas as presenças serão perdidas.')) return;
    
    try {
      const res = await fetch(`/api/encontros/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/encontros');
      } else {
        alert('Erro ao excluir encontro.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao excluir encontro.');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/encontros/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: editTema, data: editData })
      });
      if (res.ok) {
        const updated = await res.json();
        setEncontro({ ...encontro, tema: updated.tema, data: updated.data });
        setIsEditing(false);
      } else {
        alert('Erro ao atualizar encontro.');
      }
    } catch (err) {
      console.error(err);
      alert('Erro de conexão ao atualizar encontro.');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!encontro) return <div className="p-8 text-center text-red-500">Encontro não encontrado.</div>;

  const presentesCount = Object.values(presencas).filter(s => s === 'PRESENTE').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto p-4 space-y-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tema (Opcional)</label>
                  <input
                    type="text"
                    value={editTema}
                    onChange={(e) => setEditTema(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Ex: Reunião de Planejamento"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    required
                    value={editData}
                    onChange={(e) => setEditData(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    disabled={saving}
                    className="bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg hover:bg-slate-300 disabled:opacity-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-slate-800">{encontro.tema || 'Encontro sem tema'}</h1>
                <p className="text-slate-500 font-medium">
                  {new Date(encontro.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )}
          </div>
          <Link href="/encontros" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline shrink-0">Voltar para lista</Link>
        </div>

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-lg text-slate-800">Lista de Presença</h2>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-4 py-1 rounded-full">
              {presentesCount} / {pessoas.length} presentes
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {pessoas.map(pessoa => {
              const status = presencas[pessoa.id] || 'FALTA';
              return (
                <div key={pessoa.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 transition-colors gap-3">
                  <span className="font-semibold text-slate-800">{pessoa.nome}</span>
                  <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setPresencaStatus(pessoa.id, 'PRESENTE')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        status === 'PRESENTE' 
                          ? 'bg-emerald-100 text-emerald-800 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Presente
                    </button>
                    <button
                      onClick={() => setPresencaStatus(pessoa.id, 'JUSTIFICADA')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        status === 'JUSTIFICADA' 
                          ? 'bg-amber-100 text-amber-800 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Justificada
                    </button>
                    <button
                      onClick={() => setPresencaStatus(pessoa.id, 'FALTA')}
                      className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                        status === 'FALTA' 
                          ? 'bg-rose-100 text-rose-800 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      Falta
                    </button>
                  </div>
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
