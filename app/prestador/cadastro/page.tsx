
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Upload, User, Phone, Mail, MapPin, Briefcase, Star, Camera, Home } from 'lucide-react'
import Link from 'next/link'
import { useConfig } from '@/contexts/config-context'

export default function CadastroPrestadorPage() {
  const { ramos, cidades } = useConfig()
  const [step, setStep] = useState(1)
  
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
    
    // Localização
    cidade: '',
    endereco: '',
    bairro: '',
    cep: '',
    
    // Profissional
    ramoAtividade: '',
    experiencia: '',
    descricao: '',
    disponibilidade: 'manha-tarde',
    preco: '',
    
    // Documentos
    foto: null,
    documentos: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    
    if (currentStep === 1) {
      if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome é obrigatório'
      if (!formData.email) newErrors.email = 'Email é obrigatório'
      if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório'
      if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório'
    }
    
    if (currentStep === 2) {
      if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória'
      if (!formData.endereco) newErrors.endereco = 'Endereço é obrigatório'
      if (!formData.bairro) newErrors.bairro = 'Bairro é obrigatório'
      if (!formData.cep) newErrors.cep = 'CEP é obrigatório'
    }
    
    if (currentStep === 3) {
      if (!formData.ramoAtividade) newErrors.ramoAtividade = 'Ramo de atividade é obrigatório'
      if (!formData.experiencia) newErrors.experiencia = 'Experiência é obrigatória'
      if (!formData.descricao) newErrors.descricao = 'Descrição é obrigatória'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (validateStep(step)) {
      try {
        // Aqui você faria a chamada para a API
        console.log('Cadastrando prestador:', formData)
        alert('Cadastro realizado com sucesso! Aguarde aprovação.')
      } catch (error) {
        alert('Erro ao realizar cadastro. Tente novamente.')
      }
    }
  }

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
        <p className="text-gray-600">Vamos começar com suas informações básicas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="nomeCompleto">Nome Completo *</Label>
          <Input
            id="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={(e) => handleInputChange('nomeCompleto', e.target.value)}
            placeholder="Seu nome completo"
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
            placeholder="seu@email.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <Label htmlFor="telefone">Telefone/Celular *</Label>
          <Input
            id="telefone"
            value={formData.telefone}
            onChange={(e) => handleInputChange('telefone', e.target.value)}
            placeholder="(11) 99999-9999"
            className={errors.telefone ? 'border-red-500' : ''}
          />
          {errors.telefone && <p className="text-red-500 text-sm mt-1">{errors.telefone}</p>}
        </div>
        
        <div>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={formData.whatsapp}
            onChange={(e) => handleInputChange('whatsapp', e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <div>
          <Label htmlFor="cpf">CPF *</Label>
          <Input
            id="cpf"
            value={formData.cpf}
            onChange={(e) => handleInputChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            className={errors.cpf ? 'border-red-500' : ''}
          />
          {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Localização</h2>
        <p className="text-gray-600">Onde você atende seus clientes?</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="cidade">Cidade *</Label>
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
            </SelectContent>
          </Select>
          {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
        </div>
        
        <div>
          <Label htmlFor="endereco">Endereço *</Label>
          <Input
            id="endereco"
            value={formData.endereco}
            onChange={(e) => handleInputChange('endereco', e.target.value)}
            placeholder="Rua, número"
            className={errors.endereco ? 'border-red-500' : ''}
          />
          {errors.endereco && <p className="text-red-500 text-sm mt-1">{errors.endereco}</p>}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="bairro">Bairro *</Label>
            <Input
              id="bairro"
              value={formData.bairro}
              onChange={(e) => handleInputChange('bairro', e.target.value)}
              placeholder="Seu bairro"
              className={errors.bairro ? 'border-red-500' : ''}
            />
            {errors.bairro && <p className="text-red-500 text-sm mt-1">{errors.bairro}</p>}
          </div>
          
          <div>
            <Label htmlFor="cep">CEP *</Label>
            <Input
              id="cep"
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              placeholder="00000-000"
              className={errors.cep ? 'border-red-500' : ''}
            />
            {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep}</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Briefcase className="w-10 h-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Informações Profissionais</h2>
        <p className="text-gray-600">Conte-nos sobre sua experiência e serviços</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="ramoAtividade">Ramo de Atividade *</Label>
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
          <Label htmlFor="experiencia">Anos de Experiência *</Label>
          <Select value={formData.experiencia} onValueChange={(value) => handleInputChange('experiencia', value)}>
            <SelectTrigger className={errors.experiencia ? 'border-red-500' : ''}>
              <SelectValue placeholder="Selecione sua experiência" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="menos-1">Menos de 1 ano</SelectItem>
              <SelectItem value="1-3">1 a 3 anos</SelectItem>
              <SelectItem value="3-5">3 a 5 anos</SelectItem>
              <SelectItem value="5-10">5 a 10 anos</SelectItem>
              <SelectItem value="mais-10">Mais de 10 anos</SelectItem>
            </SelectContent>
          </Select>
          {errors.experiencia && <p className="text-red-500 text-sm mt-1">{errors.experiencia}</p>}
        </div>
        
        <div>
          <Label htmlFor="descricao">Descrição dos Serviços *</Label>
          <Textarea
            id="descricao"
            value={formData.descricao}
            onChange={(e) => handleInputChange('descricao', e.target.value)}
            placeholder="Descreva os serviços que você oferece, sua experiência e diferenciais..."
            rows={4}
            className={errors.descricao ? 'border-red-500' : ''}
          />
          {errors.descricao && <p className="text-red-500 text-sm mt-1">{errors.descricao}</p>}
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="disponibilidade">Disponibilidade</Label>
            <Select value={formData.disponibilidade} onValueChange={(value) => handleInputChange('disponibilidade', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manha">Manhã</SelectItem>
                <SelectItem value="tarde">Tarde</SelectItem>
                <SelectItem value="noite">Noite</SelectItem>
                <SelectItem value="manha-tarde">Manhã e Tarde</SelectItem>
                <SelectItem value="integral">Período Integral</SelectItem>
                <SelectItem value="fins-semana">Finais de Semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="preco">Preço Médio por Hora (R$)</Label>
            <Input
              id="preco"
              value={formData.preco}
              onChange={(e) => handleInputChange('preco', e.target.value)}
              placeholder="50,00"
              type="number"
              step="0.01"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Camera className="w-10 h-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Documentos e Foto</h2>
        <p className="text-gray-600">Finalize seu perfil com foto e documentos</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label>Foto do Perfil</Label>
          <div className="mt-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Clique para adicionar uma foto</p>
              <p className="text-xs text-gray-500 mt-1">Recomendado: foto profissional, formato JPG/PNG</p>
            </div>
          </div>
        </div>

        <div>
          <Label>Documentos (Opcional)</Label>
          <div className="mt-2 space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Certificados, carteira profissional, etc.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Documentos ajudam a aumentar a confiança dos clientes
          </p>
        </div>
      </div>
    </div>
  )

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNum) => (
        <div key={stepNum} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {stepNum}
          </div>
          {stepNum < 4 && (
            <div className={`w-12 h-0.5 ${
              step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
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

        {renderStepIndicator()}

        <Card>
          <CardContent className="p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <div>
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    Voltar
                  </Button>
                )}
              </div>
              
              <div className="space-x-2">
                {step < 4 ? (
                  <Button onClick={nextStep}>
                    Próximo
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                    Finalizar Cadastro
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
