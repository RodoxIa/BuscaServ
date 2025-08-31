
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CitySelector } from '@/components/city-selector'
import { Search, Star, Shield, Clock, ArrowRight, Wrench, Zap, Droplets, Paintbrush, Hammer, Key, Truck } from 'lucide-react'

export default function HomePage() {
  const categories = [
    { name: 'Pedreiros', icon: Hammer, slug: 'pedreiros', color: 'bg-orange-100 text-orange-600' },
    { name: 'Eletricistas', icon: Zap, slug: 'eletricistas', color: 'bg-yellow-100 text-yellow-600' },
    { name: 'Encanadores', icon: Droplets, slug: 'encanadores', color: 'bg-blue-100 text-blue-600' },
    { name: 'Pintores', icon: Paintbrush, slug: 'pintores', color: 'bg-purple-100 text-purple-600' },
    { name: 'Marceneiros', icon: Wrench, slug: 'marceneiros', color: 'bg-green-100 text-green-600' },
    { name: 'Chaveiros', icon: Key, slug: 'chaveiros', color: 'bg-red-100 text-red-600' },
    { name: 'Guinchos', icon: Truck, slug: 'guinchos', color: 'bg-gray-100 text-gray-600' }
  ]

  const features = [
    {
      icon: Shield,
      title: 'Profissionais Verificados',
      description: 'Todos os prestadores passam por verificação de documentos e experiência.'
    },
    {
      icon: Star,
      title: 'Sistema de Avaliações',
      description: 'Avaliações reais de clientes para ajudar na sua escolha.'
    },
    {
      icon: Clock,
      title: 'Disponibilidade Real',
      description: 'Veja a disponibilidade dos profissionais em tempo real.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Encontre os <span className="text-blue-600">melhores profissionais</span> da sua região
              </h1>
              <p className="text-xl text-gray-600">
                O BuscaServ conecta você com prestadores de serviços qualificados e avaliados pela comunidade.
                Rápido, seguro e confiável.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/buscar">
                    <Search className="w-5 h-5 mr-2" />
                    Buscar Profissionais
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/prestador/cadastro">
                    Sou um prestador
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 shadow-xl">
                <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center">
                      <Wrench className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-600 font-medium">Mais de 1000 profissionais cadastrados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Busca Rápida</h2>
            <p className="text-gray-600">Selecione sua cidade para encontrar profissionais disponíveis</p>
          </div>
          <div className="max-w-md mx-auto">
            <CitySelector className="w-full" />
            <div className="mt-4 text-center">
              <Button asChild>
                <Link href="/buscar">Ver Todos os Profissionais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Categorias de Serviços
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encontre o profissional certo para cada necessidade
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.slug}
                  href={`/buscar?categoria=${category.slug}`}
                  className="group"
                >
                  <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <CardContent className="pt-6">
                      <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o ServiçoFácil?
            </h2>
            <p className="text-lg text-gray-600">
              Qualidade e confiança em cada serviço
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="text-center group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já encontraram os melhores profissionais
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/buscar">
                Encontrar Profissionais
                <Search className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/prestador/cadastro">
                Cadastrar como Prestador
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

