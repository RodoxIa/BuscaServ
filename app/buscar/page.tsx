
'use client'

import { useState } from 'react'
import { Header } from '@/components/header'
import { CitySelector } from '@/components/city-selector'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Star, MapPin, Phone, User, Filter } from 'lucide-react'
import Link from 'next/link'

// Dados mock para demonstração
const prestadoresMock = [
  {
    id: 1,
    nome: 'João Silva',
    profissao: 'Pedreiro',
    cidade: 'São Paulo, SP',
    avaliacao: 4.8,
    totalAvaliacoes: 24,
    telefone: '(11) 99999-1111',
    disponivel: true,
    foto: '/api/placeholder/100/100'
  },
  {
    id: 2,
    nome: 'Maria Santos',
    profissao: 'Eletricista',
    cidade: 'São Paulo, SP',
    avaliacao: 4.9,
    totalAvaliacoes: 18,
    telefone: '(11) 99999-2222',
    disponivel: true,
    foto: '/api/placeholder/100/100'
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    profissao: 'Encanador',
    cidade: 'Rio de Janeiro, RJ',
    avaliacao: 4.7,
    totalAvaliacoes: 31,
    telefone: '(21) 99999-3333',
    disponivel: false,
    foto: '/api/placeholder/100/100'
  },
  {
    id: 4,
    nome: 'Ana Costa',
    profissao: 'Pintora',
    cidade: 'São Paulo, SP',
    avaliacao: 4.6,
    totalAvaliacoes: 12,
    telefone: '(11) 99999-4444',
    disponivel: true,
    foto: '/api/placeholder/100/100'
  }
]

const categorias = [
  'Todos',
  'Pedreiro',
  'Eletricista', 
  'Encanador',
  'Pintor',
  'Marceneiro',
  'Chaveiro',
  'Guincho'
]

export default function BuscarPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')
  const [selectedCity, setSelectedCity] = useState<string>('')
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false)

  const filteredPrestadores = prestadoresMock.filter(prestador => {
    const matchesSearch = prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prestador.profissao.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'todos' || 
                           prestador.profissao.toLowerCase() === selectedCategory.toLowerCase()
    
    const matchesCity = !selectedCity || prestador.cidade.includes(selectedCity)
    
    const matchesAvailability = !showOnlyAvailable || prestador.disponivel

    return matchesSearch && matchesCategory && matchesCity && matchesAvailability
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Buscar Profissionais
          </h1>
          <p className="text-gray-600">
            Encontre os melhores prestadores de serviços da sua região
          </p>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filtros de Busca</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {/* Campo de busca */}
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Seletor de cidade */}
              <CitySelector 
                onCityChange={setSelectedCity}
                className="w-full"
              />

              {/* Categoria */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem 
                      key={categoria} 
                      value={categoria.toLowerCase()}
                    >
                      {categoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Botão apenas disponíveis */}
              <Button 
                variant={showOnlyAvailable ? "default" : "outline"}
                onClick={() => setShowOnlyAvailable(!showOnlyAvailable)}
              >
                Apenas Disponíveis
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredPrestadores.length} profissiona{filteredPrestadores.length !== 1 ? 'is' : 'l'} encontrado{filteredPrestadores.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrestadores.map((prestador) => (
            <Card key={prestador.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {prestador.nome}
                      </h3>
                      <Badge 
                        variant={prestador.disponivel ? "default" : "secondary"}
                        className="ml-2 flex-shrink-0"
                      >
                        {prestador.disponivel ? 'Disponível' : 'Ocupado'}
                      </Badge>
                    </div>
                    
                    <p className="text-blue-600 font-medium mb-2">{prestador.profissao}</p>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{prestador.cidade}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1">
                        {renderStars(prestador.avaliacao)}
                      </div>
                      <span className="text-sm font-medium">{prestador.avaliacao}</span>
                      <span className="text-sm text-gray-500">
                        ({prestador.totalAvaliacoes} avaliações)
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{prestador.telefone}</span>
                      </div>
                      
                      <Button size="sm" asChild>
                        <Link href={`/prestador/${prestador.id}`}>
                          Ver Perfil
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPrestadores.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhum profissional encontrado
              </h3>
              <p className="text-gray-600 mb-4">
                Tente ajustar os filtros de busca ou ampliar a área de pesquisa.
              </p>
              <Button onClick={() => {
                setSearchTerm('')
                setSelectedCategory('todos')
                setSelectedCity('')
                setShowOnlyAvailable(false)
              }}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
