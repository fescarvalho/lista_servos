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
};

export default function EncontroDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  
  const router = useRouter();
  const [encontro, setEncontro] = useState<any>(null);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [presencas, setPresencas] = useState<Set<string>>(new Set());
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
