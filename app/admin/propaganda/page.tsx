
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useConfig } from '@/contexts/config-context'
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Plus, Edit2, Trash2, Upload, Eye, EyeOff, Settings, ArrowLeft, Home, Image } from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'

interface Propaganda {
  id: number
  titulo: string
  descricao: string
  imagem: string
  cidade: string
  ativa: boolean
  clicks: number
  visualizacoes: number
  dataInicio: string
  dataFim: string
}

export default function AdminPropagandaPage() {
  const { data: session, status } = useSession()
  const { cidades } = useConfig()
  
  // Verificar se é o admin autorizado
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || session?.user?.email !== 'wrodoxia@gmail.com') {
    redirect('/auth/signin')
  }

  const [propagandas, setPropagandas] = useState<Propaganda[]>([
    { 
      id: 1, 
      titulo: 'Material de Construção São Paulo', 
      descricao: 'Melhor preço em cimento, areia e brita', 
      imagem: '/propaganda1.jpg',
      cidade: 'São Paulo, SP',
      ativa: true,
      clicks: 234,
      visualizacoes: 1250,
      dataInicio: '2024-08-01',
      dataFim: '2024-09-01'
    },
    { 
      id: 2, 
      titulo: 'Ferramentas Rio de Janeiro', 
      descricao: 'Ferramentas profissionais com desconto', 
      imagem: '/propaganda2.jpg',
      cidade: 'Rio de Janeiro, RJ',
      ativa: false,
      clicks: 89,
      visualizacoes: 456,
      dataInicio: '2024-08-15',
      dataFim: '2024-09-15'
    },
  ])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPropaganda, setEditingPropaganda] = useState<Propaganda | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    cidade: '',
    dataInicio: '',
    dataFim: '',
    imagem: null as File | null
  })

  const cidadesAtivas = cidades.filter(cidade => cidade.ativa)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingPropaganda) {
      // Editar propaganda existente
      setPropagandas(prev => prev.map(propaganda => 
        propaganda.id === editingPropaganda.id 
          ? { 
              ...propaganda, 
              ...formData,
              imagem: formData.imagem ? URL.createObjectURL(formData.imagem) : propaganda.imagem
            }
          : propaganda
      ))
    } else {
      // Adicionar nova propaganda
      const novaPropaganda: Propaganda = {
        id: Math.max(...propagandas.map(p => p.id), 0) + 1,
        ...formData,
        imagem: formData.imagem ? URL.createObjectURL(formData.imagem) : '/placeholder-ad.jpg',
        ativa: true,
        clicks: 0,
        visualizacoes: 0,
      }
      setPropagandas(prev => [...prev, novaPropaganda])
    }
    
    setDialogOpen(false)
    setEditingPropaganda(null)
    setFormData({ titulo: '', descricao: '', cidade: '', dataInicio: '', dataFim: '', imagem: null })
  }

  const handleEdit = (propaganda: Propaganda) => {
    setEditingPropaganda(propaganda)
    setFormData({
      titulo: propaganda.titulo,
      descricao: propaganda.descricao,
      cidade: propaganda.cidade,
      dataInicio: propaganda.dataInicio,
      dataFim: propaganda.dataFim,
      imagem: null
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta propaganda?')) {
      setPropagandas(prev => prev.filter(propaganda => propaganda.id !== id))
    }
  }

  const toggleAtiva = (id: number) => {
    setPropagandas(prev => prev.map(propaganda => 
      propaganda.id === id 
        ? { ...propaganda, ativa: !propaganda.ativa }
        : propaganda
    ))
  }

  const propagandasAtivas = propagandas.filter(p => p.ativa).length
  const totalClicks = propagandas.reduce((acc, p) => acc + p.clicks, 0)
  const totalVisualizacoes = propagandas.reduce((acc, p) => acc + p.visualizacoes, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin/cidades" className="flex items-center space-x-2 text-gray-600 hover:text-blue-600">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar ao Admin</span>
              </Link>
              <div className="flex items-center space-x-2">
                <Image className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Propaganda</h1>
              </div>
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
            <span className="text-gray-900">Propaganda</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{propagandas.length}</div>
                <p className="text-sm text-gray-600">Total de Anúncios</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{propagandasAtivas}</div>
                <p className="text-sm text-gray-600">Anúncios Ativos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalVisualizacoes}</div>
                <p className="text-sm text-gray-600">Visualizações</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{totalClicks}</div>
                <p className="text-sm text-gray-600">Clicks</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Gerenciar Propagandas</h2>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Nova Propaganda</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingPropaganda ? 'Editar Propaganda' : 'Nova Propaganda'}
                </DialogTitle>
                <DialogDescription>
                  {editingPropaganda ? 'Edite as informações da propaganda' : 'Adicione uma nova propaganda ao sistema'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Input
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label>Cidade</Label>
                  <Select 
                    value={formData.cidade} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cidade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cidadesAtivas.map((cidade) => (
                        <SelectItem key={cidade.id} value={`${cidade.nome}, ${cidade.estado}`}>
                          {cidade.nome}, {cidade.estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <Label htmlFor="dataInicio">Data Início</Label>
                    <Input
                      id="dataInicio"
                      type="date"
                      value={formData.dataInicio}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataInicio: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="dataFim">Data Fim</Label>
                    <Input
                      id="dataFim"
                      type="date"
                      value={formData.dataFim}
                      onChange={(e) => setFormData(prev => ({ ...prev, dataFim: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="imagem">Imagem da Propaganda</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData(prev => ({ ...prev, imagem: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="imagem"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('imagem')?.click()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {formData.imagem ? formData.imagem.name : 'Escolher Imagem'}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingPropaganda ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de Propagandas */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Propagandas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Visualizações</TableHead>
                  <TableHead className="text-center">Clicks</TableHead>
                  <TableHead className="text-center">Período</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propagandas.map((propaganda) => (
                  <TableRow key={propaganda.id}>
                    <TableCell className="font-medium">{propaganda.titulo}</TableCell>
                    <TableCell>{propaganda.cidade}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          checked={propaganda.ativa}
                          onCheckedChange={() => toggleAtiva(propaganda.id)}
                        />
                        <span className={propaganda.ativa ? 'text-green-600' : 'text-gray-500'}>
                          {propaganda.ativa ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{propaganda.visualizacoes}</TableCell>
                    <TableCell className="text-center">{propaganda.clicks}</TableCell>
                    <TableCell className="text-center text-xs">
                      {new Date(propaganda.dataInicio).toLocaleDateString('pt-BR')} até {new Date(propaganda.dataFim).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(propaganda)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(propaganda.id)}
                          className="text-red-600 hover:text-red-700"
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
      </div>
    </div>
  )
}
