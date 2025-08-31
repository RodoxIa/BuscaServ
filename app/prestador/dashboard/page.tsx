
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useConfig } from '@/contexts/config-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ClientFormDialog } from '@/components/ui/dialog-client-form'
import { useState, useEffect } from 'react'
import { 
  User, 
  Star, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Edit2, 
  Eye,
  TrendingUp,
  MessageSquare,
  Clock,
  Users,
  Briefcase,
  Settings,
  Filter,
  Download,
  Home,
  Plus,
  Trash2,
  DollarSign
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface ClientRecord {
  id: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  serviceType: string
  value: number
  datePerformed: string
}

interface DashboardStats {
  totalClients: number
  totalRevenue: number
  serviceTypes: Record<string, number>
  monthlyRevenue: Record<string, number>
  monthlyClients: Record<string, number>
  averageServiceValue: number
}

export default function PrestadorDashboardPage() {
  const { data: session, status } = useSession()
  const { ramos } = useConfig()
  const [isAvailable, setIsAvailable] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [servicoPrincipal, setServicoPrincipal] = useState('Pedreiro')
  const [filtroData, setFiltroData] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroCliente, setFiltroCliente] = useState('')
  const [clientRecords, setClientRecords] = useState<ClientRecord[]>([])
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [clientDialogOpen, setClientDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<ClientRecord | null>(null)

  // Filtrar apenas ramos ativos para exibir
  const ramosAtivos = ramos.filter(ramo => ramo.ativo)

  useEffect(() => {
    if (status === 'authenticated') {
      loadClientRecords()
      loadDashboardStats()
    }
  }, [status])

  const loadClientRecords = async () => {
    try {
      const response = await fetch('/api/client-records')
      if (response.ok) {
        const data = await response.json()
        setClientRecords(data)
      }
    } catch (error) {
      console.error('Erro ao carregar registros de clientes:', error)
      toast.error('Erro ao carregar registros de clientes')
    } finally {
      setLoading(false)
    }
  }

  const loadDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard-stats')
      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data)
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    }
  }

  const handleDeleteClient = async (clientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      const response = await fetch(`/api/client-records/${clientId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Cliente excluído com sucesso!')
        loadClientRecords()
        loadDashboardStats()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao excluir cliente')
      }
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir cliente')
    }
  }

  const handleEditClient = (client: ClientRecord) => {
    setEditingClient(client)
    setClientDialogOpen(true)
  }

  const handleAddClient = () => {
    setEditingClient(null)
    setClientDialogOpen(true)
  }

  const handleClientSaved = () => {
    loadClientRecords()
    loadDashboardStats()
  }

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  }

  if (status === 'unauthenticated' || (session?.user as any)?.userType !== 'SERVICE_PROVIDER') {
    redirect('/auth/signin')
  }

  const avaliacoesMock = [
    { id: 1, cliente: 'Ana Silva', nota: 5, comentario: 'Excelente trabalho!', data: '2024-08-20' },
    { id: 2, cliente: 'Carlos Santos', nota: 4, comentario: 'Muito profissional.', data: '2024-08-18' },
    { id: 3, cliente: 'Maria Oliveira', nota: 5, comentario: 'Recomendo!', data: '2024-08-15' }
  ]

  const clientesFiltrados = clientRecords.filter(cliente => {
    let matches = true
    
    if (filtroCliente) {
      matches = matches && cliente.clientName.toLowerCase().includes(filtroCliente.toLowerCase())
    }
    
    if (filtroData) {
      const dataCliente = new Date(cliente.datePerformed)
      const dataFiltro = new Date(filtroData)
      matches = matches && dataCliente >= dataFiltro
    }
    
    return matches
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ))
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Status da Assinatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Status da Assinatura
            <Badge variant="default" className="bg-green-600">
              Ativa
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-900 font-medium">Plano Ativo</p>
                <p className="text-green-700 text-sm">Seu perfil está visível para os usuários</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">23</p>
                <p className="text-green-700 text-sm">dias restantes</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="availability"
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
            <Label htmlFor="availability">
              {isAvailable ? 'Disponível para novos serviços' : 'Indisponível'}
            </Label>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Serviço Principal:</strong> {servicoPrincipal}
            </p>
          </div>
          
          <Button className="w-full mt-4" variant="outline">
            Renovar Assinatura - R$ 29,90/mês
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Estatísticas */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Estatísticas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-blue-600">127</div>
                  <p className="text-sm text-gray-600">Visualizações</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <p className="text-sm text-gray-600">Contatos</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardStats?.totalClients || 0}
                  </div>
                  <p className="text-sm text-gray-600">Clientes</p>
                </div>
                <div className="text-center p-4">
                  <div className="text-2xl font-bold text-yellow-600">4.8</div>
                  <p className="text-sm text-gray-600">Avaliação</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Receita */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Receita Total</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                R$ {dashboardStats?.totalRevenue.toFixed(2).replace('.', ',') || '0,00'}
              </div>
              <p className="text-sm text-gray-600">
                Valor médio por serviço: R$ {dashboardStats?.averageServiceValue.toFixed(2).replace('.', ',') || '0,00'}
              </p>
            </CardContent>
          </Card>

          {/* Avaliações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Avaliações Recentes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {avaliacoesMock.map((avaliacao) => (
                  <div key={avaliacao.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <span className="font-medium">{avaliacao.cliente}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        {renderStars(avaliacao.nota)}
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-sm">"{avaliacao.comentario}"</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Perfil */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Meu Perfil
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('perfil')}>
                  <Edit2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold">{session?.user?.name}</h3>
                <Badge variant="outline" className="mt-1">Pedreiro</Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{session?.user?.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('clientes')}>
                <Users className="w-4 h-4 mr-2" />
                Ver Clientes
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleAddClient}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Cliente
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('servicos')}>
                <Briefcase className="w-4 h-4 mr-2" />
                Meus Serviços
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Histórico
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )

  const renderPerfil = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Perfil</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Nome Completo</Label>
              <Input defaultValue={session?.user?.name || ''} />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input defaultValue={session?.user?.email || ''} disabled />
            </div>
            <div>
              <Label>Telefone</Label>
              <Input defaultValue="(11) 99999-9999" />
            </div>
            <div>
              <Label>WhatsApp</Label>
              <Input defaultValue="(11) 99999-9999" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderServicos = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurar Serviços</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Serviço Principal</Label>
            <Select value={servicoPrincipal} onValueChange={setServicoPrincipal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ramosAtivos.map((ramo) => (
                  <SelectItem key={ramo.id} value={ramo.nome}>
                    {ramo.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600 mt-1">
              Este será o serviço destacado no seu perfil público.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Serviços Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {ramosAtivos.map((ramo) => (
              <div key={ramo.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{ramo.nome}</h4>
                  <p className="text-sm text-gray-600">Ramo de atividade</p>
                </div>
                <Switch defaultChecked={ramo.id <= 4} />
              </div>
            ))}
          </div>
          <Button className="mt-4">Salvar Configurações</Button>
        </CardContent>
      </Card>
    </div>
  )

  const renderClientes = () => (
    <div className="space-y-6">
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label>Nome do Cliente</Label>
              <Input 
                placeholder="Buscar cliente..."
                value={filtroCliente}
                onChange={(e) => setFiltroCliente(e.target.value)}
              />
            </div>
            <div>
              <Label>Data (a partir de)</Label>
              <Input 
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={() => {
                setFiltroCliente('')
                setFiltroData('')
              }}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{clientesFiltrados.length}</div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                R$ {clientesFiltrados.reduce((acc, c) => acc + c.value, 0).toFixed(2).replace('.', ',')}
              </div>
              <p className="text-sm text-gray-600">Faturamento</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {clientesFiltrados.length}
              </div>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Clientes</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.telefone}</TableCell>
                  <TableCell>{cliente.servico}</TableCell>
                  <TableCell>R$ {cliente.valor.toFixed(2).replace('.', ',')}</TableCell>
                  <TableCell>{new Date(cliente.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                    <Badge variant={cliente.status === 'Concluído' ? 'default' : cliente.status === 'Em Andamento' ? 'secondary' : 'destructive'}>
                      {cliente.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'servicos', label: 'Serviços', icon: Briefcase },
    { id: 'clientes', label: 'Clientes', icon: Users },
  ]

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
            <span className="text-gray-900">Painel do Prestador</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Painel do Prestador</h1>
          <p className="text-gray-600 mt-2">Gerencie seu perfil e acompanhe suas estatísticas</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'perfil' && renderPerfil()}
        {activeTab === 'servicos' && renderServicos()}
        {activeTab === 'clientes' && renderClientes()}
      </div>
      
      <ClientFormDialog
        open={clientDialogOpen}
        onOpenChange={setClientDialogOpen}
        client={editingClient}
        onSave={handleClientSaved}
      />
    </div>
  )
}
