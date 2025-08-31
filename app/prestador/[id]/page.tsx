
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { prisma } from '@/lib/db'
import { Star, MapPin, Phone, Mail, Clock, Shield, Award, Calendar, User } from 'lucide-react'

interface PageProps {
  params: {
    id: string
  }
}

export default async function PrestadorPerfilPage({ params }: PageProps) {
  const provider = await prisma.serviceProvider.findUnique({
    where: { 
      id: params.id,
      isActive: true 
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          city: true,
          createdAt: true
        }
      },
      category: {
        select: {
          name: true,
          slug: true,
          icon: true
        }
      },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              name: true
            }
          }
        }
      }
    }
  })

  if (!provider) {
    notFound()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-yellow-400'
            : i < rating
            ? 'text-yellow-400 fill-yellow-400 opacity-50'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {provider.businessName || provider.user.name}
                      </h1>
                      {provider.isVerified && (
                        <Badge className="bg-green-100 text-green-600">
                          <Shield className="w-3 h-3 mr-1" />
                          Verificado
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <Badge variant="secondary" className="text-sm">
                        {provider.category.name}
                      </Badge>
                      
                      <div className="flex items-center gap-1">
                        {renderStars(provider.avgRating)}
                        <span className="ml-1 font-medium">
                          {provider.avgRating.toFixed(1)}
                        </span>
                        <span className="text-gray-600">
                          ({provider.totalReviews} avaliações)
                        </span>
                      </div>
                    </div>

                    {provider.user.city && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.user.city}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              {provider.description && (
                <CardContent>
                  <h2 className="text-lg font-semibold mb-3">Sobre</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {provider.description}
                  </p>
                </CardContent>
              )}
            </Card>

            {/* Service Details */}
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Serviço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.experience && (
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-medium">Experiência:</span>
                      <span className="ml-2 text-gray-600">{provider.experience}</span>
                    </div>
                  </div>
                )}

                {provider.workingHours && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <span className="font-medium">Horário de funcionamento:</span>
                      <span className="ml-2 text-gray-600">{provider.workingHours}</span>
                    </div>
                  </div>
                )}

                {provider.priceRange && (
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 text-blue-600 text-lg">💰</span>
                    <div>
                      <span className="font-medium">Faixa de preço:</span>
                      <span className="ml-2 text-green-600 font-medium">{provider.priceRange}</span>
                    </div>
                  </div>
                )}

                {provider.serviceAreas.length > 0 && (
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">Áreas de atendimento:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 ml-8">
                      {provider.serviceAreas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {provider.certifications && (
                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <span className="font-medium">Certificações:</span>
                      <p className="text-gray-600 mt-1">{provider.certifications}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            {provider.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações ({provider.totalReviews})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {provider.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{review.user.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      
                      {review.comment && (
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                      )}
                      
                      {review.jobDescription && (
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Serviço:</span> {review.jobDescription}
                        </p>
                      )}
                      
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {provider.user.phone && (
                  <Button asChild className="w-full">
                    <Link href={`tel:${provider.user.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Ligar: {provider.user.phone}
                    </Link>
                  </Button>
                )}
                
                {provider.user.email && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`mailto:${provider.user.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Enviar Email
                    </Link>
                  </Button>
                )}

                <Button asChild variant="secondary" className="w-full">
                  <Link href="/buscar">
                    <MapPin className="w-4 h-4 mr-2" />
                    Buscar Mais Profissionais
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avaliação média:</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium">{provider.avgRating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Total de avaliações:</span>
                  <span className="font-medium">{provider.totalReviews}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Trabalhos realizados:</span>
                  <span className="font-medium">{provider.totalJobs}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Membro desde:</span>
                  <span className="font-medium">
                    {new Date(provider.user.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
