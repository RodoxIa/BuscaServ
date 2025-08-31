
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BuscaServ - Marketplace de Prestadores de Serviços',
  description: 'Encontre os melhores profissionais da sua região: pedreiros, eletricistas, encanadores, pintores e muito mais no BuscaServ.',
  keywords: 'prestadores de serviços, pedreiro, eletricista, encanador, pintor, marceneiro, chaveiro, guincho, BuscaServ',
  openGraph: {
    title: 'BuscaServ - Marketplace de Prestadores de Serviços',
    description: 'Encontre os melhores profissionais da sua região no BuscaServ.',
    type: 'website',
    url: 'https://buscaserv.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuscaServ - Marketplace de Prestadores de Serviços',
    description: 'Encontre os melhores profissionais da sua região no BuscaServ.',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
