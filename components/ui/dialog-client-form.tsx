'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

interface ClientRecord {
  id?: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  serviceType: string
  value: number
  datePerformed: string
}

interface ClientFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: ClientRecord | null
  onSave: () => void
}

export function ClientFormDialog({ open, onOpenChange, client, onSave }: ClientFormDialogProps) {
  const [formData, setFormData] = useState<ClientRecord>({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: '',
    value: 0,
    datePerformed: new Date().toISOString().split('T')[0]
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (client) {
      setFormData({
        ...client,
        datePerformed: new Date(client.datePerformed).toISOString().split('T')[0]
      })
    } else {
      setFormData({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        serviceType: '',
        value: 0,
        datePerformed: new Date().toISOString().split('T')[0]
      })
    }
  }, [client, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = client ? `/api/client-records/${client.id}` : '/api/client-records'
      const method = client ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao salvar cliente')
      }

      toast.success(client ? 'Cliente atualizado com sucesso!' : 'Cliente adicionado com sucesso!')
      onSave()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cliente')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ClientRecord, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {client ? 'Editar Cliente' : 'Adicionar Cliente'}
          </DialogTitle>
          <DialogDescription>
            {client 
              ? 'Edite as informações do cliente e do serviço prestado.'
              : 'Adicione um novo cliente e o serviço prestado.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="clientName">Nome do Cliente *</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => handleInputChange('clientName', e.target.value)}
                placeholder="Nome completo do cliente"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="clientEmail">E-mail</Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail || ''}
                onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>
            
            <div>
              <Label htmlFor="clientPhone">Telefone</Label>
              <Input
                id="clientPhone"
                value={formData.clientPhone || ''}
                onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
            
            <div>
              <Label htmlFor="serviceType">Tipo de Serviço *</Label>
              <Input
                id="serviceType"
                value={formData.serviceType}
                onChange={(e) => handleInputChange('serviceType', e.target.value)}
                placeholder="Ex: Alvenaria, Pintura, Elétrica..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="value">Valor (R$) *</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                min="0"
                value={formData.value}
                onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                placeholder="0,00"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="datePerformed">Data do Serviço *</Label>
              <Input
                id="datePerformed"
                type="date"
                value={formData.datePerformed}
                onChange={(e) => handleInputChange('datePerformed', e.target.value)}
                required
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (client ? 'Atualizar' : 'Adicionar')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

