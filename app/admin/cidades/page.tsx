
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useConfig } from '@/contexts/config-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit2, Trash2, MapPin, Users, Eye, EyeOff, Settings, Briefcase, Home } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'

interface Cidade {
  id: number
  nome: string
  estado: string
  ativa: boolean
  prestadores: number
  usuarios: number
}

export default function AdminCidadesPage() {
  const { data: session, status } = useSession()
  const { cidades, updateCidades } = useConfig()
  
  // Verificar se é o admin autorizado
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || session?.user?.email !== 'wrodoxia@gmail.com') {
    redirect('/auth/signin')
  }

  // Adicionar campos que faltam para compatibilidade
  const cidadesCompletas = cidades.map(cidade => ({
    ...cidade,
    prestadores: 25, // Mock data
    usuarios: 150,   // Mock data
  }))
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCidade, setEditingCidade] = useState<Cidade | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    estado: '',
    ativa: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCidade) {
      // Editar cidade existente
      const novasCidades = cidades.map(cidade => 
        cidade.id === editingCidade.id 
          ? { ...cidade, ...formData }
          : cidade
      )
      updateCidades(novasCidades)
    } else {
      // Adicionar nova cidade
      const novaCidade = {
        id: Math.max(...cidades.map(c => c.id), 0) + 1,
        ...formData,
      }
      updateCidades([...cidades, novaCidade])
    }
    
    setDialogOpen(false)
    setEditingCidade(null)
    setFormData({ nome: '', estado: '', ativa: true })
  }

  const handleEdit = (cidade: Cidade) => {
    setEditingCidade(cidade)
    setFormData({
      nome: cidade.nome,
      estado: cidade.estado,
      ativa: cidade.ativa
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta cidade?')) {
      const novasCidades = cidades.filter(cidade => cidade.id !== id)
      updateCidades(novasCidades)
    }
  }

  const toggleAtiva = (id: number) => {
    const novasCidades = cidades.map(cidade => 
      cidade.id === id 
        ? { ...cidade, ativa: !cidade.ativa }
        : cidade
    )
    updateCidades(novasCidades)
  }

  const cidadesAtivas = cidadesCompletas.filter(c => c.ativa).length
  const totalPrestadores = cidadesCompletas.reduce((acc, c) => acc + c.prestadores, 0)
  const totalUsuarios = cidadesCompletas.reduce((acc, c) => acc + c.usuarios, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-6xl py-6 px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-2">
                <Settings className="w-8 h-8 text-blue-600" />
                <span>Painel Administrativo - BuscaServ</span>
              </h1>
              <p className="text-gray-600 mt-2">Gerencie as cidades onde o BuscaServ está disponível</p>
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
            <span className="text-gray-900">Admin - Cidades</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{cidades.length}</div>
                <p className="text-sm text-gray-600">Total de Cidades</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{cidadesAtivas}</div>
                <p className="text-sm text-gray-600">Cidades Ativas</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalPrestadores}</div>
                <p className="text-sm text-gray-600">Total Prestadores</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{totalUsuarios}</div>
                <p className="text-sm text-gray-600">Total Usuários</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegação Rápida */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link href="/admin/ramos" className="block">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Gerenciar Ramos</h3>
                    <p className="text-sm text-gray-600">Categorias de prestadores</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Link href="/admin/configuracoes" className="block">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Configurações</h3>
                    <p className="text-sm text-gray-600">Sistema e contatos</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Botão Adicionar e Tabela */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span>Lista de Cidades</span>
            </CardTitle>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingCidade(null)
                  setFormData({ nome: '', estado: '', ativa: true })
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Cidade
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingCidade ? 'Editar Cidade' : 'Adicionar Nova Cidade'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome da Cidade</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: São Paulo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="estado">Estado (UF)</Label>
                    <Input
                      id="estado"
                      value={formData.estado}
                      onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value.toUpperCase() }))}
                      placeholder="Ex: SP"
                      maxLength={2}
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativa"
                      checked={formData.ativa}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativa: checked }))}
                    />
                    <Label htmlFor="ativa">Cidade ativa no BuscaServ</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingCidade ? 'Salvar Alterações' : 'Adicionar Cidade'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Prestadores</TableHead>
                  <TableHead className="text-center">Usuários</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cidadesCompletas.map((cidade) => (
                  <TableRow key={cidade.id}>
                    <TableCell className="font-medium">{cidade.nome}</TableCell>
                    <TableCell>{cidade.estado}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={cidade.ativa ? "default" : "secondary"}>
                          {cidade.ativa ? 'Ativa' : 'Inativa'}
                        </Badge>
                        <button
                          onClick={() => toggleAtiva(cidade.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={cidade.ativa ? 'Desativar' : 'Ativar'}
                        >
                          {cidade.ativa ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span>{cidade.prestadores}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{cidade.usuarios}</TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(cidade)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(cidade.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Dicas de Uso:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Cidades Ativas:</strong> Aparecem no seletor de cidade do site</li>
            <li>• <strong>Cidades Inativas:</strong> Não aparecem para os usuários, mas os dados são mantidos</li>
            <li>• <strong>Expansão:</strong> Adicione novas cidades conforme a demanda cresce</li>
            <li>• <strong>Propagandas:</strong> Anunciantes podem segmentar por cidade ativa</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
