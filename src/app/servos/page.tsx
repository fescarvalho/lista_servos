'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Users, Check, X, Minus, Activity, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'

type Encontro = {
  id: string
  data: string
  tema: string | null
}

type Pessoa = {
  id: string
  nome: string
  frequencia: number
  presencasMap: Record<string, string>
}

export default function ServosDashboard() {
  const [encontros, setEncontros] = useState<Encontro[]>([])
  const [pessoas, setPessoas] = useState<Pessoa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/servos')
        if (res.ok) {
          const data = await res.json()
          setEncontros(data.encontros)
          setPessoas(data.pessoas)
        } else {
          setError('Erro ao carregar dados.')
        }
      } catch (err) {
        console.error(err)
        setError('Erro de conexão ao carregar dados.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    // Add timezone offset to ensure the date is displayed as local, but simple slice works too
    // Prisma returns ISO string, e.g. "2024-10-15T00:00:00.000Z"
    // Using UTC to format correctly so we don't jump a day back
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      timeZone: 'UTC'
    }).format(date)
  }

  const isPastMeeting = (dateString: string) => {
    const meetingDate = new Date(dateString)
    meetingDate.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return meetingDate.getTime() <= now.getTime()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl shadow-sm border border-red-100 text-center">
          <p className="font-semibold text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200 transition-colors">Tentar novamente</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <div className="bg-indigo-600 text-white pb-24 pt-8 px-4 rounded-b-[3rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] rounded-full bg-white blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm transition-colors text-white">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-sm font-medium opacity-80 tracking-widest uppercase">Painel dos Servos</h1>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-2">Presença Geral</h2>
              <p className="text-indigo-100 max-w-lg leading-relaxed">
                Acompanhe o engajamento e as presenças em nossos encontros. Juntos somos mais fortes!
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-xs text-indigo-100 uppercase tracking-wider font-semibold">Total Servos</p>
                  <p className="text-2xl font-bold">{pessoas.length}</p>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center gap-4 hidden sm:flex">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Calendar className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-xs text-indigo-100 uppercase tracking-wider font-semibold">Encontros</p>
                  <p className="text-2xl font-bold">{encontros.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: The Table */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {encontros.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Calendar size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Nenhum encontro cadastrado ainda.</p>
            </div>
          ) : pessoas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Users size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-lg">Nenhum servo cadastrado ainda.</p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto custom-scrollbar pb-4">
                <table className="w-full text-left border-collapse min-w-max">
                  <thead>
                    <tr>
                      <th className="sticky left-0 z-20 bg-slate-50 p-4 border-b border-r border-slate-200 font-semibold text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        Nome do Servo
                      </th>
                      <th className="p-4 border-b border-slate-200 text-center font-semibold text-slate-700 w-32">
                        Frequência
                      </th>
                      {encontros.map(enc => {
                        const isPast = isPastMeeting(enc.data)
                        return (
                          <th key={enc.id} className="p-4 border-b border-slate-200 text-center align-top min-w-[120px]">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-sm font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-full">
                                {formatDate(enc.data)}
                              </span>
                              <span className="text-xs text-slate-500 font-medium mt-1 truncate w-full max-w-[100px]" title={enc.tema || 'Sem tema'}>
                                {enc.tema || '-'}
                              </span>
                              {!isPast && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-500 mt-1">Futuro</span>
                              )}
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="text-slate-600">
                    {pessoas.map((pessoa, index) => (
                      <tr key={pessoa.id} className={`hover:bg-indigo-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                        <td className="sticky left-0 z-10 p-4 border-b border-r border-slate-100 font-medium text-slate-800 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] bg-inherit">
                          {pessoa.nome}
                        </td>
                        <td className="p-4 border-b border-slate-100 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Activity size={16} className={pessoa.frequencia >= 75 ? "text-emerald-500" : pessoa.frequencia >= 50 ? "text-amber-500" : "text-rose-500"} />
                            <span className={`font-bold ${pessoa.frequencia >= 75 ? "text-emerald-600" : pessoa.frequencia >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                              {pessoa.frequencia}%
                            </span>
                          </div>
                        </td>
                        {encontros.map(enc => {
                          const isPast = isPastMeeting(enc.data)
                          const presente = pessoa.presencasMap[enc.id]

                          return (
                            <td key={enc.id} className="p-4 border-b border-slate-100 text-center">
                              <div className="flex justify-center">
                                {isPast ? (
                                  presente === 'PRESENTE' ? (
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                                      <Check size={18} strokeWidth={3} />
                                    </div>
                                  ) : presente === 'JUSTIFICADA' ? (
                                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm" title="Falta Justificada">
                                      <Info size={18} strokeWidth={3} />
                                    </div>
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-sm">
                                      <X size={18} strokeWidth={3} />
                                    </div>
                                  )
                                ) : (
                                  <div className="w-8 h-8 rounded-full border-2 border-dashed border-slate-200 text-slate-300 flex items-center justify-center">
                                    <Minus size={18} />
                                  </div>
                                )}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden flex flex-col gap-4 p-4 bg-slate-50">
                {pessoas.map((pessoa) => (
                  <div key={pessoa.id} className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 text-lg leading-tight w-2/3">{pessoa.nome}</h3>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${
                        pessoa.frequencia >= 75 ? "bg-emerald-100 text-emerald-700" :
                        pessoa.frequencia >= 50 ? "bg-amber-100 text-amber-700" :
                        "bg-rose-100 text-rose-700"
                      }`}>
                        <Activity size={14} />
                        {pessoa.frequencia}%
                      </div>
                    </div>
                    
                    <div className="border-t border-slate-100 pt-3">
                      <p className="text-xs text-slate-500 font-semibold mb-3 uppercase tracking-wider">Histórico de Presenças</p>
                      <div className="flex overflow-x-auto pb-3 gap-3 custom-scrollbar">
                        {encontros.map(enc => {
                          const isPast = isPastMeeting(enc.data)
                          const presente = pessoa.presencasMap[enc.id]
                          
                          return (
                            <div key={enc.id} className="flex-shrink-0 flex flex-col items-center gap-2 w-[60px]">
                              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{formatDate(enc.data)}</span>
                              {isPast ? (
                                presente === 'PRESENTE' ? (
                                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                                    <Check size={20} strokeWidth={3} />
                                  </div>
                                ) : presente === 'JUSTIFICADA' ? (
                                  <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shadow-sm" title="Falta Justificada">
                                    <Info size={20} strokeWidth={3} />
                                  </div>
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center shadow-sm">
                                    <X size={20} strokeWidth={3} />
                                  </div>
                                )
                              ) : (
                                <div className="w-10 h-10 rounded-full border-2 border-dashed border-slate-200 text-slate-300 flex items-center justify-center">
                                  <Minus size={20} />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
        
        {/* Legend */}
        {encontros.length > 0 && pessoas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-6 items-center justify-center text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Check size={14} strokeWidth={3} />
              </div>
              <span>Presente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
                <X size={14} strokeWidth={3} />
              </div>
              <span>Falta</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Info size={14} strokeWidth={3} />
              </div>
              <span>Falta Justificada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-dashed border-slate-200 text-slate-300 flex items-center justify-center">
                <Minus size={14} />
              </div>
              <span>Encontro Futuro</span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  )
}
