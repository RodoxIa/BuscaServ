
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Phone, Mail, MapPin, Home, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useConfig } from '@/contexts/config-context'
import { useRouter } from 'next/navigation'

export default function SignupUsuarioPage() {
  const { cidades } = useConfig()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  
  // Filtrar apenas cidades ativas
  const cidadesAtivas = cidades.filter(cidade => cidade.ativa)
  
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    telefone: '',
    cidade: '',
    senha: '',
    confirmarSenha: '',
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
    if (!formData.senha) newErrors.senha = 'Senha é obrigatória'
    if (formData.senha.length < 6) newErrors.senha = 'Senha deve ter pelo menos 6 caracteres'
    if (!formData.confirmarSenha) newErrors.confirmarSenha = 'Confirmação de senha é obrigatória'
    if (formData.senha !== formData.confirmarSenha) newErrors.confirmarSenha = 'Senhas não coincidem'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setLoading(true)
    try {
      // Simular cadastro
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess(true)
    } catch (error) {
      console.error('Erro no cadastro:', error)
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
              <span className="text-gray-900">Cadastro de Usuário</span>
            </div>
          </div>
        </div>

        <div className="py-8">
          <div className="container mx-auto max-w-md px-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-600 text-center">
                  <CheckCircle className="w-5 h-5" />
                  <span>Cadastro Concluído!</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="bg-green-50 p-6 rounded-lg">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-900 mb-2">Bem-vindo ao BuscaServ!</h3>
                  <p className="text-green-800">
                    Sua conta foi criada com sucesso. Agora você pode buscar e contratar prestadores de serviços.
                  </p>
                </div>
                
                <Button 
                  onClick={() => router.push('/auth/signin')} 
                  className="w-full" 
                  size="lg"
                >
                  Fazer Login
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => router.push('/')} 
                  className="w-full"
                >
                  Ir para Página Inicial
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
            <span className="text-gray-900">Cadastro de Usuário</span>
          </div>
        </div>
      </div>

      <div className="py-8">
        <div className="container mx-auto max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
            <p className="text-gray-600">Crie sua conta para contratar prestadores</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Dados Pessoais</span>
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
                
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <select
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange('cidade', e.target.value)}
                    className={`w-full p-2 border rounded-md ${errors.cidade ? 'border-red-500' : ''}`}
                  >
                    <option value="">Selecione sua cidade</option>
                    {cidadesAtivas.map((cidade) => (
                      <option key={cidade.id} value={`${cidade.nome}, ${cidade.estado}`}>
                        {cidade.nome}, {cidade.estado}
                      </option>
                    ))}
                    <option value="outros">Outros (minha cidade não está na lista)</option>
                  </select>
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
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Criando conta...' : 'Criar Conta'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/auth/signin" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              É um prestador de serviços?{' '}
              <Link href="/auth/signup-prestador" className="text-blue-600 hover:underline">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
