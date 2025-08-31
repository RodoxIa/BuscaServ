
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Star, Crown, Zap, Home } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PlanoProps {
  nome: string
  preco: string
  periodo: string
  destaque?: boolean
  recursos: string[]
  icone: React.ReactNode
  cor: string
}

const planos: PlanoProps[] = [
  {
    nome: 'Básico',
    preco: '29,90',
    periodo: '/mês',
    icone: <Star className="w-6 h-6" />,
    cor: 'border-gray-200',
    recursos: [
      'Perfil visível para clientes',
      'Receber até 10 contatos/mês',
      'Suporte por email',
      'Estatísticas básicas',
      '1 foto no perfil'
    ]
  },
  {
    nome: 'Profissional',
    preco: '49,90',
    periodo: '/mês',
    destaque: true,
    icone: <Crown className="w-6 h-6" />,
    cor: 'border-blue-500',
    recursos: [
      'Tudo do plano Básico',
      'Contatos ilimitados',
      'Perfil destacado nas buscas',
      'Até 5 fotos no perfil',
      'Suporte prioritário por WhatsApp',
      'Relatórios detalhados',
      'Badge "Profissional Verificado"',
      'Agendamento de serviços'
    ]
  },
  {
    nome: 'Premium',
    preco: '79,90',
    periodo: '/mês',
    icone: <Zap className="w-6 h-6" />,
    cor: 'border-purple-500',
    recursos: [
      'Tudo do plano Profissional',
      'Aparece no topo das buscas',
      'Fotos ilimitadas',
      'Site próprio integrado',
      'Sistema de agendamento avançado',
      'Análise de concorrência',
      'Suporte 24/7',
      'Marketing automático',
      'Certificado digital',
      'API para integração'
    ]
  }
]

export default function AssinaturasPage() {
  const [planoSelecionado, setPlanoSelecionado] = useState('')
  const [processandoPagamento, setProcessandoPagamento] = useState(false)

  const handleContratarPlano = async (plano: string, preco: string) => {
    setPlanoSelecionado(plano)
    setProcessandoPagamento(true)
    
    try {
      // Simular processamento de pagamento
      // Aqui seria integrado com API de pagamento (Stripe, PagSeguro, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular resposta de sucesso
      const pagamentoAprovado = true
      
      if (pagamentoAprovado) {
        // Aqui atualizaria o status da assinatura no banco
        alert(`Parabéns! Seu plano ${plano} foi ativado com sucesso!`)
        // Poderia redirecionar para o dashboard
        // router.push('/prestador/dashboard')
      } else {
        alert('Pagamento não aprovado. Tente novamente.')
      }
    } catch (error) {
      alert('Erro no processamento. Tente novamente.')
    }
    
    setProcessandoPagamento(false)
    setPlanoSelecionado('')
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
            <span className="text-gray-900">Planos e Assinaturas</span>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="container mx-auto max-w-6xl px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o Plano Ideal para Seu Negócio
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seja encontrado pelos clientes da sua região. Aumente sua visibilidade e 
              faça mais negócios com os planos do BuscaServ.
            </p>
          </div>

          {/* Garantias */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-12">
            <div className="grid gap-4 md:grid-cols-3 text-center">
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">7 dias grátis</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Cancele quando quiser</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Suporte incluído</span>
              </div>
            </div>
          </div>

          {/* Planos */}
          <div className="grid gap-8 md:grid-cols-3 mb-12">
            {planos.map((plano, index) => (
              <Card key={index} className={`relative ${plano.cor} ${plano.destaque ? 'shadow-xl scale-105 ring-2 ring-blue-500' : 'shadow-lg'}`}>
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <div className={`mx-auto w-12 h-12 ${plano.destaque ? 'text-blue-600' : 'text-gray-600'} mb-4`}>
                    {plano.icone}
                  </div>
                  <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">R$ {plano.preco}</span>
                    <span className="text-gray-600">{plano.periodo}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plano.recursos.map((recurso, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{recurso}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-6 ${plano.destaque ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                    variant={plano.destaque ? 'default' : 'outline'}
                    onClick={() => handleContratarPlano(plano.nome, plano.preco)}
                    disabled={processandoPagamento && planoSelecionado === plano.nome}
                  >
                    {processandoPagamento && planoSelecionado === plano.nome 
                      ? 'Processando...' 
                      : `Escolher ${plano.nome}`
                    }
                  </Button>
                  
                  {plano.destaque && (
                    <p className="text-xs text-center text-green-600 font-medium">
                      Economia de 40% comparado ao Básico
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Posso trocar de plano a qualquer momento?</h4>
                <p className="text-gray-600">
                  Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                  As mudanças entram em vigor imediatamente.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Como funciona o período grátis?</h4>
                <p className="text-gray-600">
                  Todos os novos prestadores têm 7 dias grátis para testar a plataforma. 
                  Durante este período, você terá acesso a todos os recursos do plano escolhido.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Posso cancelar minha assinatura?</h4>
                <p className="text-gray-600">
                  Claro! Você pode cancelar sua assinatura a qualquer momento através do seu 
                  painel de controle. Não há taxas de cancelamento.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Quais formas de pagamento são aceitas?</h4>
                <p className="text-gray-600">
                  Aceitamos cartões de crédito (Visa, Mastercard), débito, PIX e boleto bancário. 
                  Todos os pagamentos são processados de forma segura.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA Final */}
          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold mb-4">Pronto para começar?</h3>
            <p className="text-gray-600 mb-6">
              Junte-se a centenas de prestadores que já estão fazendo mais negócios com o BuscaServ
            </p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/auth/signup-prestador">Começar Agora</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contato">Falar com Consultor</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
