
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hammer, Zap, Droplets, Paintbrush, Wrench, Key, Truck, ArrowRight } from 'lucide-react'
import { prisma } from '@/lib/db'

export default async function CategoriasPage() {
  const categories = await prisma.serviceCategory.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: { serviceProviders: true }
      }
    },
    orderBy: { name: 'asc' }
  })

  const iconMap: Record<string, any> = {
    hammer: Hammer,
    zap: Zap,
    droplets: Droplets,
    paintbrush: Paintbrush,
    wrench: Wrench,
    key: Key,
    truck: Truck
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todas as Categorias
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore todos os tipos de serviços disponíveis na nossa plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon || 'wrench'] || Wrench
            return (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {category._count.serviceProviders} profissiona{category._count.serviceProviders !== 1 ? 'is' : 'l'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {category.description && (
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  )}
                  
                  <Button asChild className="w-full group">
                    <Link href={`/buscar?categoria=${category.slug}`}>
                      Ver Profissionais
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {categories.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma categoria encontrada
              </h3>
              <p className="text-gray-600">
                Ainda não há categorias cadastradas no sistema.
              </p>
            </CardContent>
          </Card>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                É um prestador de serviços?
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Cadastre-se gratuitamente e conecte-se com milhares de clientes
              </p>
              <Button size="lg" asChild>
                <Link href="/prestador/cadastro">
                  Cadastrar como Prestador
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  )
}
