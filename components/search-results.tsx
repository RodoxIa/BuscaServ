
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Star, MapPin, Phone, Shield, Clock } from 'lucide-react'

interface ServiceProvider {
  id: string
  businessName?: string
  description?: string
  experience?: string
  serviceAreas: string[]
  priceRange?: string
  images: string[]
  isVerified: boolean
  avgRating: number
  totalReviews: number
  user: {
    name?: string
    phone?: string
    city?: string
  }
  category: {
    name: string
    slug: string
  }
}

export function SearchResults() {
  const searchParams = useSearchParams()
  const [providers, setProviders] = useState<ServiceProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const params = new URLSearchParams()
        
        // Build search parameters
        const categoria = searchParams?.get('categoria')
        const cidade = searchParams?.get('cidade')
        const minRating = searchParams?.get('minRating')
        const verificado = searchParams?.get('verificado')
        const busca = searchParams?.get('busca')

        if (categoria) params.set('categoria', categoria)
        if (cidade) params.set('cidade', cidade)
        if (minRating) params.set('minRating', minRating)
        if (verificado) params.set('verificado', verificado)
        if (busca) params.set('busca', busca)

        const response = await fetch(`/api/providers?${params.toString()}`)
        if (!response.ok) throw new Error('Erro ao buscar prestadores')
        
        const data = await response.json()
        setProviders(data.providers || [])
      } catch (error) {
        console.error('Error fetching providers:', error)
        setError('Erro ao carregar prestadores')
      } finally {
        setLoading(false)
      }
    }

    fetchProviders()
  }, [searchParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Nenhum prestador encontrado
          </h3>
          <p className="text-gray-600 mb-4">
            Tente ajustar os filtros ou busque por uma região diferente
          </p>
          <Button asChild>
            <Link href="/buscar">Limpar Filtros</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          {providers.length} prestador{providers.length !== 1 ? 'es' : ''} encontrado{providers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {provider.businessName || provider.user.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{provider.category.name}</Badge>
                    {provider.isVerified && (
                      <Badge className="bg-green-100 text-green-600">
                        <Shield className="w-3 h-3 mr-1" />
                        Verificado
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{provider.avgRating.toFixed(1)}</span>
                  <span className="text-gray-600">({provider.totalReviews})</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {provider.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {provider.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                {provider.experience && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{provider.experience}</span>
                  </div>
                )}
                
                {provider.user.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{provider.user.city}</span>
                  </div>
                )}
              </div>

              {provider.serviceAreas.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Atende em:</p>
                  <div className="flex flex-wrap gap-1">
                    {provider.serviceAreas.slice(0, 3).map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                    {provider.serviceAreas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.serviceAreas.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {provider.priceRange && (
                <div className="text-sm">
                  <span className="text-gray-600">Faixa de preço: </span>
                  <span className="font-medium text-green-600">{provider.priceRange}</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button asChild className="flex-1">
                  <Link href={`/prestador/${provider.id}`}>Ver Perfil</Link>
                </Button>
                {provider.user.phone && (
                  <Button variant="outline" asChild>
                    <Link href={`tel:${provider.user.phone}`}>
                      <Phone className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
