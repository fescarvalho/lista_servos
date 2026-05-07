'use client'

import { useState, useEffect } from 'react'
import { Calendar, User, ArrowLeft, Users, Lock, MapPin, Eye, EyeOff, Trash2, Edit2, X, Check, Save } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function ListaPage() {
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [pessoas, setPessoas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [editingPessoa, setEditingPessoa] = useState<any | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    nome: '',
    bairro: '',
    dataNascimento: ''
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'adminservos') {
      setIsAuthorized(true)
      fetchData()
    } else {
      setError('Senha incorreta. Tente novamente.')
      setTimeout(() => setError(''), 3000)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pessoas')
      if (response.ok) {

        const data = await response.json()
        setPessoas(data)
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cadastro?')) return

    try {
      const response = await fetch(`/api/pessoas/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPessoas(pessoas.filter(p => p.id !== id))
      } else {
        alert('Erro ao excluir o registro')
      }
    } catch (err) {
      console.error('Erro ao excluir:', err)
      alert('Erro ao excluir o registro')
    }
  }

  const handleStartEdit = (pessoa: any) => {
    setEditingPessoa(pessoa)
    setEditForm({
      nome: pessoa.nome,
      bairro: pessoa.bairro || '',
      dataNascimento: new Date(pessoa.dataNascimento).toISOString().split('T')[0]
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPessoa) return

    setLoading(true)
    try {
      const response = await fetch(`/api/pessoas/${editingPessoa.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const updated = await response.json()
        setPessoas(pessoas.map(p => p.id === updated.id ? updated : p))
        setEditingPessoa(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Erro ao atualizar o registro')
      }
    } catch (err) {
      console.error('Erro ao atualizar:', err)
      alert('Erro ao atualizar o registro')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthorized) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/20">
              <Lock size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-center">Acesso Restrito</h1>
            <p className="text-slate-400 text-center text-sm mt-2">Somente administradores podem visualizar a lista total.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Senha de Acesso</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Digite a senha..."
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <AnimatePresence>
                {error && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-xs mt-1 ml-1"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-indigo-600/20"
            >
              Entrar
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link href="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2">
              <ArrowLeft size={16} />
              Voltar para o cadastro
            </Link>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-2 md:p-12 bg-slate-50 text-slate-900">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <Link 
              href="/"
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors mb-2"
            >
              <ArrowLeft size={20} />
              Voltar para o formulário
            </Link>
            <h1 className="text-3xl font-bold text-slate-800">Painel do Administrador</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2 text-slate-600">
              <Users size={20} className="text-indigo-500" />
              <span className="font-bold text-lg">{pessoas.length}</span>
              <span className="text-sm font-medium">cadastros</span>
            </div>
            <button 
              onClick={() => setIsAuthorized(false)}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-slate-700 text-sm font-medium transition-colors"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Nome</th>
                  <th className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Bairro</th>
                  <th className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">Nascimento</th>
                  <th className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 hidden lg:table-cell">Data Cadastro</th>
                  <th className="px-2 sm:px-6 py-4 text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        Carregando dados...
                      </div>
                    </td>
                  </tr>
                ) : pessoas.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                      Nenhum cadastro encontrado.
                    </td>
                  </tr>
                ) : (
                  pessoas.map((pessoa) => (
                    <tr key={pessoa.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors text-xs sm:text-base">
                            {pessoa.nome.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 text-xs sm:text-sm">{pessoa.nome}</span>
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-1 sm:gap-2 text-slate-600 text-xs sm:text-sm">
                          <MapPin size={14} className="text-slate-400 hidden sm:block" />
                          {pessoa.bairro || '---'}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-slate-600 text-xs sm:text-sm whitespace-nowrap">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Calendar size={14} className="text-slate-400 hidden sm:block" />
                          {new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-slate-400 text-[10px] sm:text-sm hidden lg:table-cell">
                        {new Date(pessoa.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-2 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleStartEdit(pessoa)}
                            className="p-1 sm:p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(pessoa.id)}
                            className="p-1 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editingPessoa && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setEditingPessoa(null)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800">Editar Cadastro</h2>
                  <button 
                    onClick={() => setEditingPessoa(null)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleUpdate} className="p-6 space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Nome Completo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        required
                        value={editForm.nome}
                        onChange={(e) => setEditForm({...editForm, nome: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Bairro</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        required
                        value={editForm.bairro}
                        onChange={(e) => setEditForm({...editForm, bairro: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Data de Nascimento</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="date"
                        required
                        value={editForm.dataNascimento}
                        onChange={(e) => setEditForm({...editForm, dataNascimento: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingPessoa(null)}
                      className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Save size={18} />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
