
'use client'

import { useState, useEffect } from 'react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MapPin } from 'lucide-react'
import { useConfig } from '@/contexts/config-context'

interface Cidade {
  id: number
  nome: string
  estado: string
  ativa: boolean
}

interface CitySelectorProps {
  onCityChange?: (city: string) => void
  className?: string
}

export function CitySelector({ onCityChange, className }: CitySelectorProps) {
  const { cidades } = useConfig()
  
  const [selectedCity, setSelectedCity] = useState<string>('sao-paulo')

  const cidadesAtivas = cidades.filter(cidade => cidade.ativa)

  const handleCityChange = (value: string) => {
    setSelectedCity(value)
    const cidade = cidadesAtivas.find(c => 
      `${c.nome.toLowerCase().replace(/\s+/g, '-')}-${c.estado.toLowerCase()}` === value
    )
    if (cidade && onCityChange) {
      onCityChange(`${cidade.nome}, ${cidade.estado}`)
    }
  }

  return (
    <div className={className}>
      <Select value={selectedCity} onValueChange={handleCityChange}>
        <SelectTrigger className="w-full">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <SelectValue placeholder="Selecione sua cidade" />
          </div>
        </SelectTrigger>
        <SelectContent>
          {cidadesAtivas.map((cidade) => (
            <SelectItem 
              key={cidade.id} 
              value={`${cidade.nome.toLowerCase().replace(/\s+/g, '-')}-${cidade.estado.toLowerCase()}`}
            >
              {cidade.nome}, {cidade.estado}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
