
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Upload, User, Phone, Mail, MapPin, Briefcase, Star, Camera, Home, CreditCard, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useConfig } from '@/contexts/config-context'
import { useRouter } from 'next/navigation'

export default function SignupPrestadorPage() {
  const { ramos, cidades } = useConfig()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  // Filtrar apenas itens ativos
  const ramosAtivos = ramos.filter(ramo => ramo.ativo)
  const cidadesAtivas = cidades.filter(cidade => cidade.ativa)
  
  const [formData, setFormData] = useState({
    // Dados pessoais
    nomeCompleto: '',
    email: '',
    telefone: '',
    whatsapp: '',
    cpf: '',
    cidade: '',
    endereco: '',
    
    // Dados profissionais
    ramoAtividade: '',
    experiencia: '',
    descricao: '',
    precoMedio: '',
    
    // Documentos
    fotoPerfil: null as File | null,
    fotoTrabalho1: null as File | null,
    fotoTrabalho2: null as File | null,
    
    // Senha
    senha: '',
    confirmarSenha: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateCPF = (cpf: string) => {
    cpf = cpf.replace(/[^\d]/g, '')
    if (cpf.length !== 11) return false
    
    // Verificar sequências iguais
    if (/^(\d)\1{10}$/.test(cpf)) return false
    
    // Validar dígitos
    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let digit1 = 11 - (sum % 11)
    if (digit1 > 9) digit1 = 0
    
    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i)
    }
    let digit2 = 11 - (sum % 11)
    if (digit2 > 9) digit2 = 0
    
    return digit1 === parseInt(cpf.charAt(9)) && digit2 === parseInt(cpf.charAt(10))
  }

  const validateStep = (stepNumber: number) => {
    const newErrors: {[key: string]: string} = {}
    
    if (stepNumber === 1) {
      if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome completo é obrigatório'
      if (!formData.email) newErrors.email = 'E-mail é obrigatório'
      if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório'
      if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
      else if (!validateCPF(formData.cpf)) newErrors.cpf = 'CPF inválido'
      if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória'
    }
    
    if (stepNumber === 2) {
      if (!formData.ramoAtividade) newErrors.ramoAtividade = 'Ramo de atividade é obrigatório'
      if (!formData.experiencia) newErrors.experiencia = 'Experiência é obrigatória'
      if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória'
    }
    
    if (stepNumber === 3) {
      if (!formData.fotoPerfil) newErrors.fotoPerfil = 'Foto do perfil é obrigatória'
    }
    
    if (stepNumber === 4) {
      if (!formData.senha) newErrors.senha = 'Senha é obrigatória'
      if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
      if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória'
      if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não coincidem'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(4)) return
    
    setLoading(true)
    try {
      // Simular cadastro
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirecionar para tela de pagamento
      setStep(5) // Tela de pagamento
    } catch (error) {
      console.error('Erro no cadastro:', error)
    }
    setLoading(false)
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep(6) // Sucesso
    } catch (error) {
      console.error('Erro no pagamento:', error)
    }
    setLoading(false)
  }

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Dados Pessoais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="nomeCompleto">Nome Completo *</Label>
            <Input
              id="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
              className={errors.nomeCompleto ? 'border-red-500' : ''}
            />
            {errors.nomeCompleto && <p className="text-red-500 text-sm mt-1">{errors.nomeCompleto}</p>}
          </div>
          
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              placeholder="(11) 99999-9999"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              className={errors.telefone ? 'border-red-500' : ''}
            />
            {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
          </div>
          
          <div>
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              placeholder="(11) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => handleInputChange('whatsapp', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="cpf">CPF *</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              className={errors.cpf ? 'border-red-500' : ''}
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>
          
          <div>
            <Label>Cidade *</Label>
            <Select value={formData.cidade} onValueChange={(value) => handleInputChange('cidade', value)}>
              <SelectTrigger className={errors.cidade ? 'border-red-500' : ''}>
                <SelectValue placeholder="Selecione sua cidade" />
              </SelectTrigger>
              <SelectContent>
                {cidadesAtivas.map((cidade) => (
                  <SelectItem key={cidade.id} value={`${cidade.nome}, ${cidade.estado}`}>
                    {cidade.nome}, {cidade.estado}
                  </SelectItem>
                ))}
                <SelectItem value="outros">Outros (minha cidade não está na lista)</SelectItem>
              </SelectContent>
            </Select>
            {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
            {formData.cidade === 'outros' && (
              <div className="mt-2">
                <p className="text-sm text-blue-600 mb-2">
                  Sua cidade não está disponível. Clique no botão abaixo para solicitá-la:
                </p>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => window.open('/auth/signup-outros', '_blank')}
                  className="w-full"
                >
                  Solicitar Minha Cidade
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="endereco">Endereço</Label>
          <Input
            id="endereco"
            placeholder="Rua, número, bairro"
            value={formData.endereco}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5" />
          <span>Dados Profissionais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Ramo de Atividade *</Label>
          <Select value={formData.ramoAtividade} onValueChange={(value) => handleInputChange('ramoAtividade', value)}>
            <SelectTrigger className={errors.ramoAtividade ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione seu ramo de atividade" />
            </SelectTrigger>
            <SelectContent>
              {ramosAtivos.map((ramo) => (
                <SelectItem key={ramo.id} value={ramo.nome}>{ramo.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.ramoAtividade && <p className="text-red-500 text-sm mt-1">{errors.ramoAtividade}</p>}
        </div>
        
        <div>
          <Label>Experiência *</Label>
          <Select value={formData.experiencia} onValueChange={(value) => handleInputChange('experiencia', value)}>
            <SelectTrigger className={errors.experiencia ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione sua experiência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iniciante">Iniciante (menos de 1 ano)</SelectItem>
              <SelectItem value="intermediario">Intermediário (1-3 anos)</SelectItem>
              <SelectItem value="experiente">Experiente (3-5 anos)</SelectItem>
              <SelectItem value="especialista">Especialista (mais de 5 anos)</SelectItem>
            </SelectContent>
          </Select>
          {errors.experiencia && <p className="text-red-500 text-sm mt-1">{errors.experiencia}</p>}
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição dos Serviços *</Label>
          <Textarea
            id="descricao"
            placeholder="Descreva os serviços que você oferece..."
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            className={errors.descricao ? 'border-red-500' : ''}
            rows={4}
          />
          {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
        </div>
        
        <div>
          <Label htmlFor="precoMedio">Preço Médio por Serviço (R$)</Label>
          <Input
            id="precoMedio"
            type="number"
            placeholder="150"
            value={formData.precoMedio}
            onChange={(e) => handleInputChange('precoMedio', e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Camera className="w-5 h-5" />
          <span>Fotos e Documentos</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Foto do Perfil *</Label>
          <div className="mt-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload('fotoPerfil', e.target.files?.[0] || null)}
              className="hidden"
              id="fotoPerfil"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('fotoPerfil')?.click()}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {formData.fotoPerfil ? formData.fotoPerfil.name : 'Escolher Foto do Perfil'}
            </Button>
          </div>
          {errors.fotoPerfil && <p className="text-red-500 text-sm mt-1">{errors.fotoPerfil}</p>}
        </div>
        
        <div>
          <Label>Fotos de Trabalhos Anteriores</Label>
          <div className="grid gap-2 mt-2">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('fotoTrabalho1', e.target.files?.[0] || null)}
                className="hidden"
                id="fotoTrabalho1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('fotoTrabalho1')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {formData.fotoTrabalho1 ? formData.fotoTrabalho1.name : 'Foto de Trabalho 1'}
              </Button>
            </div>
            
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload('fotoTrabalho2', e.target.files?.[0] || null)}
                className="hidden"
                id="fotoTrabalho2"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('fotoTrabalho2')?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                {formData.fotoTrabalho2 ? formData.fotoTrabalho2.name : 'Foto de Trabalho 2'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderStep4 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Criar Senha</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="senha">Senha *</Label>
          <Input
            id="senha"
            type="password"
            value={formData.senha}
            onChange={(e) => handleInputChange('senha', e.target.value)}
            className={errors.senha ? 'border-red-500' : ''}
          />
          {errors.senha && <p className="text-red-500 text-sm mt-1">{errors.senha}</p>}
        </div>
        
        <div>
          <Label htmlFor="confirmarSenha">Confirmar Senha *</Label>
          <Input
            id="confirmarSenha"
            type="password"
            value={formData.confirmarSenha}
            onChange={(e) => handleInputChange('confirmarSenha', e.target.value)}
            className={errors.confirmarSenha ? 'border-red-500' : ''}
          />
          {errors.confirmarSenha && <p className="text-red-500 text-sm mt-1">{errors.confirmarSenha}</p>}
        </div>
      </CardContent>
    </Card>
  )

  const renderStep5 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Ativação da Conta</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Plano Prestador BuscaServ</h3>
          <div className="text-blue-800">
            <p>✓ Perfil visível para todos os usuários</p>
            <p>✓ Receber contatos de clientes</p>
            <p>✓ Gerenciar sua agenda</p>
            <p>✓ Sistema de avaliações</p>
            <p>✓ Suporte prioritário</p>
          </div>
          <div className="mt-3 text-2xl font-bold text-blue-900">
            R$ 29,90/mês
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Importante:</strong> Seu perfil só ficará visível para os usuários após a confirmação do pagamento. 
            Você terá 7 dias grátis para testar a plataforma!
          </p>
        </div>
        
        <Button 
          onClick={handlePayment} 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? 'Processando...' : 'Ativar Conta - R$ 29,90/mês'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={() => router.push('/')} 
          className="w-full"
        >
          Pular por Agora (Perfil Invisível)
        </Button>
      </CardContent>
    </Card>
  )

  const renderStep6 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-5 h-5" />
          <span>Cadastro Concluído!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <div className="bg-green-50 p-6 rounded-lg">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="font-semibold text-green-900 mb-2">Bem-vindo ao BuscaServ!</h3>
          <p className="text-green-800">
            Seu cadastro foi concluído com sucesso. Seu perfil já está ativo e visível para os usuários.
          </p>
        </div>
        
        <Button 
          onClick={() => router.push('/')} 
          className="w-full" 
          size="lg"
        >
          Ir para Página Inicial
        </Button>
      </CardContent>
    </Card>
  )

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
            <span className="text-gray-900">Cadastro de Prestador</span>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastro de Prestador</h1>
            <p className="text-gray-600">Junte-se ao BuscaServ e encontre novos clientes</p>
          </div>

          {/* Progress Steps */}
          {step <= 4 && (
            <div className="flex justify-center mb-8">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {stepNumber}
                    </div>
                    {stepNumber < 4 && (
                      <div className={`w-12 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
            {step === 6 && renderStep6()}

            {/* Navigation Buttons */}
            {step <= 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                >
                  Voltar
                </Button>
                
                {step < 4 ? (
                  <Button type="button" onClick={handleNext}>
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
