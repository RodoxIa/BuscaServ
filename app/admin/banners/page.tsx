
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

export default function AdminBannersPage() {
  const { data: session, status } = useSession()
  const { cidades, banners, updateBanners } = useConfig()
  
  // Verificar se é o admin autorizado
  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || session?.user?.email !== 'wrodoxia@gmail.com') {
    redirect('/auth/signin')
  }
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<any>(null)
  const [formData, setFormData] = useState({
    cidadeId: '',
    titulo: '',
    link: '',
    imagem: null as File | null
  })

  const cidadesAtivas = cidades.filter(cidade => cidade.ativa)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBanner) {
      // Editar banner existente
      const novosBanners = banners.map(banner => 
        banner.id === editingBanner.id 
          ? { 
              ...banner, 
              cidadeId: parseInt(formData.cidadeId),
              titulo: formData.titulo,
              link: formData.link,
              imagem: formData.imagem ? URL.createObjectURL(formData.imagem) : banner.imagem
            }
          : banner
      )
      updateBanners(novosBanners)
    } else {
      // Adicionar novo banner
      const novoBanner = {
        id: Math.max(...banners.map(b => b.id), 0) + 1,
        cidadeId: parseInt(formData.cidadeId),
        titulo: formData.titulo,
        link: formData.link,
        imagem: formData.imagem ? URL.createObjectURL(formData.imagem) : 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
        ativo: true
      }
      updateBanners([...banners, novoBanner])
    }
    
    setDialogOpen(false)
    setEditingBanner(null)
    setFormData({ cidadeId: '', titulo: '', link: '', imagem: null })
  }

  const handleEdit = (banner: any) => {
    setEditingBanner(banner)
    setFormData({
      cidadeId: banner.cidadeId.toString(),
      titulo: banner.titulo,
      link: banner.link || '',
      imagem: null
    })
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este banner?')) {
      const novosBanners = banners.filter(banner => banner.id !== id)
      updateBanners(novosBanners)
    }
  }

  const toggleAtivo = (id: number) => {
    const novosBanners = banners.map(banner => 
      banner.id === id 
        ? { ...banner, ativo: !banner.ativo }
        : banner
    )
    updateBanners(novosBanners)
  }

  const getCidadeNome = (cidadeId: number) => {
    const cidade = cidades.find(c => c.id === cidadeId)
    return cidade ? `${cidade.nome}, ${cidade.estado}` : 'Cidade não encontrada'
  }

  const bannersAtivos = banners.filter(b => b.ativo).length

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
                <h1 className="text-2xl font-bold text-gray-900">Banners por Cidade</h1>
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
            <span className="text-gray-900">Banners</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{banners.length}</div>
                <p className="text-sm text-gray-600">Total de Banners</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{bannersAtivos}</div>
                <p className="text-sm text-gray-600">Banners Ativos</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{cidadesAtivas.length}</div>
                <p className="text-sm text-gray-600">Cidades Disponíveis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">Gerenciar Banners</h2>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Novo Banner</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? 'Editar Banner' : 'Novo Banner'}
                </DialogTitle>
                <DialogDescription>
                  {editingBanner ? 'Edite as informações do banner' : 'Adicione um novo banner por cidade'}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Cidade</Label>
                  <Select 
                    value={formData.cidadeId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cidadeId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {cidadesAtivas.map((cidade) => (
                        <SelectItem key={cidade.id} value={cidade.id.toString()}>
                          {cidade.nome}, {cidade.estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="titulo">Título do Banner</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                    placeholder="Ex: Materiais de Construção"
                  />
                </div>
                
                <div>
                  <Label htmlFor="link">Link (opcional)</Label>
                  <Input
                    id="link"
                    value={formData.link}
                    onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                    placeholder="https://exemplo.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="imagem">Imagem do Banner</Label>
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
                      {formData.imagem ? formData.imagem.name : 'Escolher Imagem (800x200px)'}
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingBanner ? 'Salvar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabela de Banners */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Banners</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Imagem</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner) => (
                  <TableRow key={banner.id}>
                    <TableCell>
                      <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                        <img 
                          src={banner.imagem} 
                          alt={banner.titulo} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200'
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{banner.titulo}</TableCell>
                    <TableCell>{getCidadeNome(banner.cidadeId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Switch
                          checked={banner.ativo}
                          onCheckedChange={() => toggleAtivo(banner.id)}
                        />
                        <span className={banner.ativo ? 'text-green-600' : 'text-gray-500'}>
                          {banner.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(banner)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(banner.id)}
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
