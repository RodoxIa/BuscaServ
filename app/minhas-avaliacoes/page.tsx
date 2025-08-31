
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Calendar, User, MessageSquare, Home } from 'lucide-react'
import Link from 'next/link'

const avaliacoesMock = [
  {
    id: 1,
    prestador: 'João Silva - Pedreiro',
    servico: 'Construção de Muro',
    nota: 5,
    comentario: 'Excelente trabalho! Muito profissional e pontual.',
    data: '2024-08-20'
  },
  {
    id: 2,
    prestador: 'Maria Santos - Eletricista',
    servico: 'Instalação Elétrica',
    nota: 4,
    comentario: 'Bom trabalho, mas demorou um pouco mais que o esperado.',
    data: '2024-08-15'
  },
  {
    id: 3,
    prestador: 'Pedro Oliveira - Encanador',
    servico: 'Reparo de Vazamento',
    nota: 5,
    comentario: 'Muito rápido e eficiente. Recomendo!',
    data: '2024-08-10'
  }
]

export default function MinhasAvaliacoesPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl py-4 px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900">Minhas Avaliações</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Minhas Avaliações</h1>
          <p className="text-gray-600 mt-2">Veja todas as avaliações que você fez</p>
        </div>

      {/* Estatísticas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resumo das Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">{avaliacoesMock.length}</div>
              <p className="text-sm text-gray-600">Total de Avaliações</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {(avaliacoesMock.reduce((acc, av) => acc + av.nota, 0) / avaliacoesMock.length).toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Nota Média Dada</p>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                {avaliacoesMock.filter(av => av.nota >= 4).length}
              </div>
              <p className="text-sm text-gray-600">Avaliações Positivas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Avaliações */}
      <div className="space-y-4">
        {avaliacoesMock.map((avaliacao) => (
          <Card key={avaliacao.id}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                <div className="flex items-center space-x-3 mb-2 md:mb-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{avaliacao.prestador}</h3>
                    <p className="text-sm text-gray-600">{avaliacao.servico}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-1">
                  {renderStars(avaliacao.nota)}
                </div>
                <Badge variant="outline">
                  {avaliacao.nota} estrela{avaliacao.nota !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {avaliacao.comentario && (
                <div className="flex items-start space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 italic">"{avaliacao.comentario}"</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    </div>
  )
}
