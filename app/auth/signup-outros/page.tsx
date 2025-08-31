
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
import { MapPin, CheckCircle, Home, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupOutrosPage() {
  const router = useRouter()
  const [tipoUsuario, setTipoUsuario] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidade: '',
    estado: '',
    justificativa: '',
    tipoUsuario: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!formData.nomeCompleto) newErrors.nomeCompleto = 'Nome completo é obrigatório'
    if (!formData.email) newErrors.email = 'E-mail é obrigatório'
    if (!formData.telefone) newErrors.telefone = 'Telefone é obrigatório'
    if (!formData.cidade) newErrors.cidade = 'Cidade é obrigatória'
    if (!formData.estado) newErrors.estado = 'Estado é obrigatório'
    if (!formData.tipoUsuario) newErrors.tipoUsuario = 'Tipo de usuário é obrigatório'
    if (!formData.justificativa) newErrors.justificativa = 'Justificativa é obrigatória'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // Simular envio de email para admin
      const emailData = {
        to: 'wrodoxia@gmail.com',
        subject: `Nova Cidade Solicitada: ${formData.cidade}, ${formData.estado}`,
        body: `
          Nova solicitação de cidade:
          
          Nome: ${formData.nomeCompleto}
          Email: ${formData.email}
          Telefone: ${formData.telefone}
          Cidade: ${formData.cidade}
          Estado: ${formData.estado}
          Tipo: ${formData.tipoUsuario}
          Justificativa: ${formData.justificativa}
          
          Esta pessoa está interessada em se cadastrar no BuscaServ.
        `
      }
      
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSuccess(true)
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error)
    }
    setLoading(false)
  }

  if (success) {
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
              <span className="text-gray-900">Solicitação de Cidade</span>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="container mx-auto max-w-md px-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600 text-center">
                  <CheckCircle className="w-5 h-5" />
                  <span>Solicitação Enviada!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="bg-green-50 p-6 rounded-lg">
                  <Mail className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-900 mb-2">Obrigado pelo interesse!</h3>
                  <p className="text-green-800">
                    Sua solicitação para incluir <strong>{formData.cidade}, {formData.estado}</strong> foi 
                    enviada para nossa equipe.
                  </p>
                  <p className="text-green-800 mt-2">
                    Entraremos em contato em breve para confirmar o cadastro da cidade.
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Próximos passos:</strong><br/>
                    1. Análise da solicitação (1-2 dias úteis)<br/>
                    2. Contato da nossa equipe<br/>
                    3. Ativação da cidade no sistema<br/>
                    4. Notificação para finalizar seu cadastro
                  </p>
                </div>
                
                <Button 
                  onClick={() => router.push('/')} 
                  className="w-full" 
                  size="lg"
                >
                  Voltar à Página Inicial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
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
            <span className="text-gray-900">Solicitar Nova Cidade</span>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sua Cidade não está na Lista?</h1>
            <p className="text-gray-600">Solicite o cadastro da sua cidade no BuscaServ</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Solicitar Nova Cidade</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <Label htmlFor="cidade">Cidade *</Label>
                    <Input
                      id="cidade"
                      placeholder="Nome da cidade"
                      value={formData.cidade}
                      onChange={(e) => handleInputChange('cidade', e.target.value)}
                      className={errors.cidade ? 'border-red-500' : ''}
                    />
                    {errors.cidade && <p className="text-red-500 text-sm mt-1">{errors.cidade}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="estado">Estado *</Label>
                    <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                      <SelectTrigger className={errors.estado ? 'border-red-500' : ''}>
                        <SelectValue placeholder="UF" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="AL">AL</SelectItem>
                        <SelectItem value="AP">AP</SelectItem>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="BA">BA</SelectItem>
                        <SelectItem value="CE">CE</SelectItem>
                        <SelectItem value="DF">DF</SelectItem>
                        <SelectItem value="ES">ES</SelectItem>
                        <SelectItem value="GO">GO</SelectItem>
                        <SelectItem value="MA">MA</SelectItem>
                        <SelectItem value="MT">MT</SelectItem>
                        <SelectItem value="MS">MS</SelectItem>
                        <SelectItem value="MG">MG</SelectItem>
                        <SelectItem value="PA">PA</SelectItem>
                        <SelectItem value="PB">PB</SelectItem>
                        <SelectItem value="PR">PR</SelectItem>
                        <SelectItem value="PE">PE</SelectItem>
                        <SelectItem value="PI">PI</SelectItem>
                        <SelectItem value="RJ">RJ</SelectItem>
                        <SelectItem value="RN">RN</SelectItem>
                        <SelectItem value="RS">RS</SelectItem>
                        <SelectItem value="RO">RO</SelectItem>
                        <SelectItem value="RR">RR</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="SP">SP</SelectItem>
                        <SelectItem value="SE">SE</SelectItem>
                        <SelectItem value="TO">TO</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.estado && <p className="text-red-500 text-sm mt-1">{errors.estado}</p>}
                  </div>
                </div>
                
                <div>
                  <Label>Tipo de Usuário *</Label>
                  <Select value={formData.tipoUsuario} onValueChange={(value) => handleInputChange('tipoUsuario', value)}>
                    <SelectTrigger className={errors.tipoUsuario ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usuario">Usuário (quero contratar serviços)</SelectItem>
                      <SelectItem value="prestador">Prestador de Serviços</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoUsuario && <p className="text-red-500 text-sm mt-1">{errors.tipoUsuario}</p>}
                </div>
                
                <div>
                  <Label htmlFor="justificativa">Por que sua cidade deveria estar no BuscaServ? *</Label>
                  <Textarea
                    id="justificativa"
                    placeholder="Ex: Nossa cidade tem mais de 50.000 habitantes e muitas obras em andamento..."
                    value={formData.justificativa}
                    onChange={(e) => handleInputChange('justificativa', e.target.value)}
                    className={errors.justificativa ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {errors.justificativa && <p className="text-red-500 text-sm mt-1">{errors.justificativa}</p>}
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Enviando solicitação...' : 'Solicitar Cadastro da Cidade'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Sua cidade já está na lista?{' '}
              <Link href="/auth/signup-usuario" className="text-blue-600 hover:underline">
                Fazer cadastro normal
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
