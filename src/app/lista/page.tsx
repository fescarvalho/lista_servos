import prisma from '@/lib/prisma'
import { motion } from 'framer-motion' // Wait, can't use motion in server component easily without 'use client'
import { Calendar, User, ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic' // Ensure we get fresh data

export default async function ListaPage() {
  const pessoas = await prisma.pessoa.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main className="flex flex-col items-center min-h-screen p-4 md:p-24 bg-gradient-to-br from-indigo-50 via-white to-slate-50 text-slate-900">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Voltar para o formulário
          </Link>
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={20} />
            <span className="font-semibold">{pessoas.length}</span> cadastros
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-3xl font-bold text-slate-800">Pessoas Cadastradas</h1>
            <p className="text-slate-500">Lista completa do grupo</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-8 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Nome</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Data de Nascimento</th>
                  <th className="px-8 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-100">Cadastrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pessoas.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-slate-400 italic">
                      Nenhum cadastro encontrado.
                    </td>
                  </tr>
                ) : (
                  pessoas.map((pessoa) => (
                    <tr key={pessoa.id} className="hover:bg-indigo-50/30 transition-colors">
                      <td className="px-8 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <User size={16} />
                          </div>
                          {pessoa.nome}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-slate-400" />
                          {new Date(pessoa.dataNascimento).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-8 py-4 text-slate-400 text-sm">
                        {new Date(pessoa.createdAt).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}
