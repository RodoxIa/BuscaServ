
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useConfig } from '@/contexts/config-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Settings, ArrowLeft, Save, Phone, Mail, Lock, Globe, DollarSign, Home } from 'lucide-react'
import Link from 'next/link'

export default function AdminConfiguracoesPage() {
  const { data: session, status } = useSession()
  const { config, updateConfig } = useConfig()
  
  // Verificar se é o admin autorizado
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || session?.user?.email !== 'wrodoxia@gmail.com') {
    redirect('/auth/signin')
  }

  const [configuracoes, setConfiguracoes] = useState({
    // Contato
    telefoneSuporte: config.telefoneSuporte,
    emailContato: config.emailContato,
    whatsappSuporte: config.whatsappSuporte,
    
    // Sistema
    senhaAdminAtual: '',
    novaSenha: '',
    confirmarSenha: '',
    
    // Site
    nomeEmpresa: config.nomeEmpresa,
    descricaoEmpresa: config.descricaoEmpresa,
    urlSite: config.urlSite,
    
    // Preços
    precoBasico: '29.00',
    precoPremium: '49.00',
    precoAnuncio: '199.00',
    precoDestaque: '399.00',
  })

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setConfiguracoes(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveContato = async () => {
    setSaving(true)
    try {
      // Atualizar contexto global
      updateConfig({
        telefoneSuporte: configuracoes.telefoneSuporte,
        emailContato: configuracoes.emailContato,
        whatsappSuporte: configuracoes.whatsappSuporte,
      })
      
      // Simular salvamento no backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Informações de contato atualizadas com sucesso!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erro ao salvar. Tente novamente.')
    }
    setSaving(false)
  }

  const handleSaveSenha = async () => {
    if (configuracoes.novaSenha !== configuracoes.confirmarSenha) {
      setMessage('As senhas não coincidem!')
      return
    }
    
    if (configuracoes.novaSenha.length < 6) {
      setMessage('A nova senha deve ter pelo menos 6 caracteres!')
      return
    }

    setSaving(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Senha alterada com sucesso!')
      setConfiguracoes(prev => ({ 
        ...prev, 
        senhaAdminAtual: '', 
        novaSenha: '', 
        confirmarSenha: '' 
      }))
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erro ao alterar senha. Tente novamente.')
    }
    setSaving(false)
  }

  const handleSaveGeral = async () => {
    setSaving(true)
    try {
      // Atualizar contexto global
      updateConfig({
        nomeEmpresa: configuracoes.nomeEmpresa,
        descricaoEmpresa: configuracoes.descricaoEmpresa,
        urlSite: configuracoes.urlSite,
      })
      
      // Simular salvamento no backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage('Configurações gerais atualizadas com sucesso!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Erro ao salvar. Tente novamente.')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl py-6 px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/cidades">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                  <Settings className="w-8 h-8 text-blue-600" />
                  <span>Configurações do Sistema</span>
                </h1>
                <p className="text-gray-600 mt-2">Gerencie as configurações do BuscaServ</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Admin: {session?.user?.email}
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl py-4 px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600 flex items-center space-x-1">
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/admin/cidades" className="hover:text-blue-600">Admin</Link>
            <span>/</span>
            <span className="text-gray-900">Configurações</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl py-8 px-4">
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('sucesso') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid gap-6">
          {/* Informações de Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Phone className="w-5 h-5" />
                <span>Informações de Contato</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="telefoneSuporte">Telefone de Suporte</Label>
                  <Input
                    id="telefoneSuporte"
                    value={configuracoes.telefoneSuporte}
                    onChange={(e) => handleInputChange('telefoneSuporte', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsappSuporte">WhatsApp Suporte</Label>
                  <Input
                    id="whatsappSuporte"
                    value={configuracoes.whatsappSuporte}
                    onChange={(e) => handleInputChange('whatsappSuporte', e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="emailContato">E-mail de Contato</Label>
                <Input
                  id="emailContato"
                  type="email"
                  value={configuracoes.emailContato}
                  onChange={(e) => handleInputChange('emailContato', e.target.value)}
                  placeholder="contato@buscaserv.com"
                />
              </div>
              
              <Button onClick={handleSaveContato} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Informações de Contato
              </Button>
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="w-5 h-5" />
                <span>Segurança</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="senhaAdminAtual">Senha Atual</Label>
                <Input
                  id="senhaAdminAtual"
                  type="password"
                  value={configuracoes.senhaAdminAtual}
                  onChange={(e) => handleInputChange('senhaAdminAtual', e.target.value)}
                  placeholder="Digite sua senha atual"
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="novaSenha">Nova Senha</Label>
                  <Input
                    id="novaSenha"
                    type="password"
                    value={configuracoes.novaSenha}
                    onChange={(e) => handleInputChange('novaSenha', e.target.value)}
                    placeholder="Digite a nova senha"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={configuracoes.confirmarSenha}
                    onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
                    placeholder="Confirme a nova senha"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveSenha} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          {/* Configurações Gerais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Configurações Gerais</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="nomeEmpresa">Nome da Empresa</Label>
                  <Input
                    id="nomeEmpresa"
                    value={configuracoes.nomeEmpresa}
                    onChange={(e) => handleInputChange('nomeEmpresa', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="urlSite">URL do Site</Label>
                  <Input
                    id="urlSite"
                    value={configuracoes.urlSite}
                    onChange={(e) => handleInputChange('urlSite', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="descricaoEmpresa">Descrição da Empresa</Label>
                <Textarea
                  id="descricaoEmpresa"
                  value={configuracoes.descricaoEmpresa}
                  onChange={(e) => handleInputChange('descricaoEmpresa', e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button onClick={handleSaveGeral} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Configurações Gerais
              </Button>
            </CardContent>
          </Card>

          {/* Preços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Configurações de Preços</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="precoBasico">Plano Básico (R$)</Label>
                  <Input
                    id="precoBasico"
                    type="number"
                    step="0.01"
                    value={configuracoes.precoBasico}
                    onChange={(e) => handleInputChange('precoBasico', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="precoPremium">Plano Premium (R$)</Label>
                  <Input
                    id="precoPremium"
                    type="number"
                    step="0.01"
                    value={configuracoes.precoPremium}
                    onChange={(e) => handleInputChange('precoPremium', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="precoAnuncio">Banner Pequeno (R$)</Label>
                  <Input
                    id="precoAnuncio"
                    type="number"
                    step="0.01"
                    value={configuracoes.precoAnuncio}
                    onChange={(e) => handleInputChange('precoAnuncio', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="precoDestaque">Banner Destaque (R$)</Label>
                  <Input
                    id="precoDestaque"
                    type="number"
                    step="0.01"
                    value={configuracoes.precoDestaque}
                    onChange={(e) => handleInputChange('precoDestaque', e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveGeral} disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                Salvar Preços
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
