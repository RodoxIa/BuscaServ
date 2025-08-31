
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MapPin, Star, Filter } from 'lucide-react'

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState({
    categoria: searchParams?.get('categoria') || 'todas',
    cidade: searchParams?.get('cidade') || 'todas',
    minRating: searchParams?.get('minRating') || 'qualquer',
    verificado: searchParams?.get('verificado') === 'true',
    busca: searchParams?.get('busca') || ''
  })

  const categories = [
    { value: 'pedreiros', label: 'Pedreiros' },
    { value: 'eletricistas', label: 'Eletricistas' },
    { value: 'encanadores', label: 'Encanadores' },
    { value: 'pintores', label: 'Pintores' },
    { value: 'marceneiros', label: 'Marceneiros' },
    { value: 'chaveiros', label: 'Chaveiros' },
    { value: 'guinchos', label: 'Guinchos' }
  ]

  const cities = [
    'São Paulo',
    'Guarulhos',
    'Osasco',
    'Santo André',
    'São Bernardo do Campo',
    'São Caetano do Sul',
    'Diadema',
    'Mauá',
    'Cotia',
    'Embu das Artes',
    'Taboão da Serra'
  ]

  const applyFilters = () => {
    const params = new URLSearchParams()
    
    if (filters.categoria && filters.categoria !== 'todas') params.set('categoria', filters.categoria)
    if (filters.cidade && filters.cidade !== 'todas') params.set('cidade', filters.cidade)
    if (filters.minRating && filters.minRating !== 'qualquer') params.set('minRating', filters.minRating)
    if (filters.verificado) params.set('verificado', 'true')
    if (filters.busca) params.set('busca', filters.busca)

    router.push(`/buscar?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      categoria: 'todas',
      cidade: 'todas',
      minRating: 'qualquer',
      verificado: false,
      busca: ''
    })
    router.push('/buscar')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="space-y-2">
          <Label htmlFor="busca">Buscar por nome</Label>
          <Input
            id="busca"
            placeholder="Nome do profissional..."
            value={filters.busca}
            onChange={(e) => setFilters({...filters, busca: e.target.value})}
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <Label>Categoria</Label>
          <Select value={filters.categoria} onValueChange={(value) => setFilters({...filters, categoria: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as categorias</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City Filter */}
        <div className="space-y-2">
          <Label>Cidade</Label>
          <Select value={filters.cidade} onValueChange={(value) => setFilters({...filters, cidade: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as cidades</SelectItem>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label>Avaliação mínima</Label>
          <Select value={filters.minRating} onValueChange={(value) => setFilters({...filters, minRating: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Qualquer avaliação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="qualquer">Qualquer avaliação</SelectItem>
              <SelectItem value="4">4+ estrelas</SelectItem>
              <SelectItem value="4.5">4.5+ estrelas</SelectItem>
              <SelectItem value="5">5 estrelas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verified Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="verificado"
            checked={filters.verificado}
            onCheckedChange={(checked) => setFilters({...filters, verificado: checked as boolean})}
          />
          <Label htmlFor="verificado" className="text-sm">
            Apenas profissionais verificados
          </Label>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-4">
          <Button onClick={applyFilters} className="w-full">
            Aplicar Filtros
          </Button>
          <Button onClick={clearFilters} variant="outline" className="w-full">
            Limpar Filtros
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
