
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface ConfigContextType {
  config: {
    telefoneSuporte: string
    emailContato: string
    whatsappSuporte: string
    nomeEmpresa: string
    descricaoEmpresa: string
    urlSite: string
  }
  cidades: Array<{
    id: number
    nome: string
    estado: string
    ativa: boolean
  }>
  ramos: Array<{
    id: number
    nome: string
    ativo: boolean
    icone: string
  }>
  banners: Array<{
    id: number
    cidadeId: number
    titulo: string
    imagem: string
    link?: string
    ativo: boolean
  }>
  updateConfig: (newConfig: any) => void
  updateCidades: (cidades: any[]) => void
  updateRamos: (ramos: any[]) => void
  updateBanners: (banners: any[]) => void
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState({
    telefoneSuporte: '(11) 99999-9999',
    emailContato: 'contato@buscaserv.com',
    whatsappSuporte: '(11) 99999-9999',
    nomeEmpresa: 'BuscaServ',
    descricaoEmpresa: 'Conectamos você aos melhores prestadores de serviços da sua região.',
    urlSite: 'https://buscaserv.com',
  })

  const [cidades, setCidades] = useState([
    { id: 1, nome: 'São Paulo', estado: 'SP', ativa: true },
    { id: 2, nome: 'Rio de Janeiro', estado: 'RJ', ativa: true },
    { id: 3, nome: 'Belo Horizonte', estado: 'MG', ativa: false },
    { id: 4, nome: 'Curitiba', estado: 'PR', ativa: true },
  ])

  const [ramos, setRamos] = useState([
    { id: 1, nome: 'Pedreiro', ativo: true, icone: '🧱' },
    { id: 2, nome: 'Eletricista', ativo: true, icone: '⚡' },
    { id: 3, nome: 'Encanador', ativo: true, icone: '🔧' },
    { id: 4, nome: 'Pintor', ativo: true, icone: '🎨' },
    { id: 5, nome: 'Marceneiro', ativo: true, icone: '🪵' },
    { id: 6, nome: 'Chaveiro', ativo: true, icone: '🔑' },
    { id: 7, nome: 'Guincho', ativo: true, icone: '🚛' },
    { id: 8, nome: 'Jardineiro', ativo: false, icone: '🌱' },
    { id: 9, nome: 'Limpeza', ativo: true, icone: '🧽' },
    { id: 10, nome: 'Manutenção Geral', ativo: true, icone: '⚙️' },
  ])

  const [banners, setBanners] = useState([
    { 
      id: 1, 
      cidadeId: 1, // São Paulo
      titulo: 'Construção São Paulo', 
      imagem: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800',
      link: 'https://exemplo.com',
      ativo: true 
    },
    { 
      id: 2, 
      cidadeId: 2, // Rio de Janeiro
      titulo: 'Obras Rio de Janeiro', 
      imagem: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
      link: 'https://exemplo.com',
      ativo: true 
    }
  ])

  const updateConfig = (newConfig: any) => {
    setConfig(prev => ({ ...prev, ...newConfig }))
  }

  const updateCidades = (newCidades: any[]) => {
    setCidades(newCidades)
  }

  const updateRamos = (newRamos: any[]) => {
    setRamos(newRamos)
  }

  const updateBanners = (newBanners: any[]) => {
    setBanners(newBanners)
  }

  return (
    <ConfigContext.Provider value={{
      config,
      cidades,
      ramos,
      banners,
      updateConfig,
      updateCidades,
      updateRamos,
      updateBanners
    }}>
      {children}
    </ConfigContext.Provider>
  )
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider')
  }
  return context
}
