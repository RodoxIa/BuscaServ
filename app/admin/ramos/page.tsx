
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
import { Plus, Edit2, Trash2, Briefcase, Eye, EyeOff, Settings, ArrowLeft, Home } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import Link from 'next/link'

interface Ramo {
  id: number
  nome: string
  ativo: boolean
  prestadores: number
  icone: string
}

export default function AdminRamosPage() {
  const { data: session, status } = useSession()
  const { ramos, updateRamos } = useConfig()
  
  // Verificar se é o admin autorizado
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || session?.user?.email !== 'wrodoxia@gmail.com') {
    redirect('/auth/signin')
  }

  // Adicionar campo prestadores para compatibilidade (mock data)
  const ramosCompletos = ramos.map(ramo => ({
    ...ramo,
    prestadores: Math.floor(Math.random() * 30) + 5, // Mock data aleatório
  }))
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRamo, setEditingRamo] = useState<Ramo | null>(null)
  const [formData, setFormData] = useState({
    nome: '',
    ativo: true,
    icone: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingRamo) {
      // Editar ramo existente
      const novosRamos = ramos.map(ramo => 
        ramo.id === editingRamo.id 
          ? { ...ramo, ...formData }
          : ramo
      )
      updateRamos(novosRamos)
    } else {
      // Adicionar novo ramo
      const novoRamo = {
        id: Math.max(...ramos.map(r => r.id), 0) + 1,
        ...formData,
      }
      updateRamos([...ramos, novoRamo])
    }
    
    setDialogOpen(false)
    setEditingRamo(null)
    setFormData({ nome: '', ativo: true, icone: '' })
  }

  const handleEdit = (ramo: Ramo) => {
    setEditingRamo(ramo)
    setFormData({
      nome: ramo.nome,
      ativo: ramo.ativo,
      icone: ramo.icone || '🔧'
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    const ramo = ramosCompletos.find(r => r.id === id)
    if (ramo?.prestadores && ramo.prestadores > 0) {
      alert('Não é possível excluir um ramo que possui prestadores cadastrados.')
      return
    }
    
    if (confirm('Tem certeza que deseja excluir este ramo de atividade?')) {
      const novosRamos = ramos.filter(ramo => ramo.id !== id)
      updateRamos(novosRamos)
    }
  }

  const toggleAtivo = (id: number) => {
    const novosRamos = ramos.map(ramo => 
      ramo.id === id 
        ? { ...ramo, ativo: !ramo.ativo }
        : ramo
    )
    updateRamos(novosRamos)
  }

  const ramosAtivos = ramosCompletos.filter(r => r.ativo).length
  const totalPrestadores = ramosCompletos.reduce((acc, r) => acc + r.prestadores, 0)

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
                  <Briefcase className="w-8 h-8 text-blue-600" />
                  <span>Gerenciar Ramos de Atividade</span>
                </h1>
                <p className="text-gray-600 mt-2">Gerencie os ramos de atividade disponíveis no BuscaServ</p>
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
            <span className="text-gray-900">Ramos</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{ramos.length}</div>
                <p className="text-sm text-gray-600">Total de Ramos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{ramosAtivos}</div>
                <p className="text-sm text-gray-600">Ramos Ativos</p>
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
        </div>

        {/* Tabela de Ramos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Lista de Ramos de Atividade</span>
            </CardTitle>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingRamo(null)
                  setFormData({ nome: '', ativo: true, icone: '' })
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Ramo
                </Button>
              </DialogTrigger>
              
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRamo ? 'Editar Ramo de Atividade' : 'Adicionar Novo Ramo de Atividade'}
                  </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome do Ramo</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Jardineiro"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="icone">Ícone (Emoji)</Label>
                    <div className="grid gap-2">
                      <Input
                        id="icone"
                        value={formData.icone}
                        onChange={(e) => setFormData(prev => ({ ...prev, icone: e.target.value }))}
                        placeholder="Ex: 🌱"
                        required
                      />
                      <div className="flex flex-wrap gap-2">
                        {['🧱', '⚡', '🔧', '🎨', '🪵', '🔑', '🚛', '🌱', '🧽', '⚙️', '🏠', '🔨', '🪚', '🔩'].map(emoji => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, icone: emoji }))}
                            className="p-2 hover:bg-gray-100 rounded text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="ativo"
                      checked={formData.ativo}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, ativo: checked }))}
                    />
                    <Label htmlFor="ativo">Ramo ativo no BuscaServ</Label>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">
                      {editingRamo ? 'Salvar Alterações' : 'Adicionar Ramo'}
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
                  <TableHead>Ícone</TableHead>
                  <TableHead>Ramo de Atividade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Prestadores</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ramosCompletos.map((ramo) => (
                  <TableRow key={ramo.id}>
                    <TableCell className="text-2xl">{ramo.icone || '🔧'}</TableCell>
                    <TableCell className="font-medium">{ramo.nome}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge variant={ramo.ativo ? "default" : "secondary"}>
                          {ramo.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                        <button
                          onClick={() => toggleAtivo(ramo.id)}
                          className="text-gray-400 hover:text-gray-600"
                          title={ramo.ativo ? 'Desativar' : 'Ativar'}
                        >
                          {ramo.ativo ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{ramo.prestadores}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(ramo)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(ramo.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={ramo.prestadores > 0}
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
            <li>• <strong>Ramos Ativos:</strong> Aparecem no formulário de cadastro de prestadores</li>
            <li>• <strong>Ramos Inativos:</strong> Não aparecem para novos cadastros, mas mantém os dados existentes</li>
            <li>• <strong>Exclusão:</strong> Só é possível excluir ramos que não possuem prestadores cadastrados</li>
            <li>• <strong>Organização:</strong> Mantenha apenas ramos relevantes para sua região ativo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
