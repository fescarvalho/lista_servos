'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, Send, Loader2, CheckCircle2, MapPin } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { pessoaSchema } from '@/lib/validations'

export default function RegistrationForm() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    bairro: '',
    dataNascimento: '',
  })
  const [errors, setErrors] = useState<{ nome?: string; bairro?: string; dataNascimento?: string }>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Client-side validation
    const validation = pessoaSchema.safeParse(formData)
    
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors
      setErrors({
        nome: fieldErrors.nome?.[0],
        bairro: fieldErrors.bairro?.[0],
        dataNascimento: fieldErrors.dataNascimento?.[0],
      })
      setLoading(false)
      toast.error('Por favor, corrija os erros no formulário.')
      return
    }

    try {
      const response = await fetch('/api/pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao enviar dados')
      }

      toast.success('Cadastro realizado com sucesso!', {
        icon: <CheckCircle2 className="text-green-500" />,
        duration: 4000,
      })
      
      // Clear form
      setFormData({ nome: '', bairro: '', dataNascimento: '' })
    } catch (error: any) {
      toast.error(error.message || 'Ocorreu um erro inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
    >
      <div className="p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">FORMAÇÃO DE SERVOS E SERVAS DO ALTAR</h1>
          <p className="text-slate-500 text-sm font-medium">PAROQUIA SANTUARIO DIOCESANO NOSSA SENHORA DA NATIVIDADE</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                id="nome"
                name="nome"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.nome ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="Ex: João Silva"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
            {errors.nome && (
              <p className="mt-1 text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div>
            <label htmlFor="bairro" className="block text-sm font-medium text-slate-700 mb-1">
              Bairro
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <MapPin size={18} />
              </div>
              <input
                type="text"
                id="bairro"
                name="bairro"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.bairro ? 'border-red-500' : 'border-slate-200'
                }`}
                placeholder="Ex: Centro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
            </div>
            {errors.bairro && (
              <p className="mt-1 text-sm text-red-500">{errors.bairro}</p>
            )}
          </div>

          <div>
            <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-700 mb-1">
              Data de Nascimento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Calendar size={18} />
              </div>
              <input
                type="date"
                id="dataNascimento"
                name="dataNascimento"
                required
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
                  errors.dataNascimento ? 'border-red-500' : 'border-slate-200'
                }`}
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
              />
            </div>
            {errors.dataNascimento && (
              <p className="mt-1 text-sm text-red-500">{errors.dataNascimento}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar Cadastro</span>
              </>
            )}
          </button>
        </form>
      </div>
      
      <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col items-center gap-2">
        <p className="text-xs text-slate-400 text-center">
          Dados protegidos e armazenados com segurança.
        </p>
        <a 
          href="/lista" 
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium underline transition-colors"
        >
          Ver todos os cadastros
        </a>
      </div>
    </motion.div>
  )
}
