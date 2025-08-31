
'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useConfig } from '@/contexts/config-context'

export function Footer() {
  const { config } = useConfig()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="font-bold text-xl">{config.nomeEmpresa}</span>
            </div>
            <p className="text-gray-300 mb-4">
              {config.descricaoEmpresa}
            </p>
            <div className="flex items-center space-x-2 text-gray-300 mb-2">
              <Mail className="w-4 h-4" />
              <span>{config.emailContato}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Phone className="w-4 h-4" />
              <span>{config.telefoneSuporte}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/buscar" className="hover:text-blue-400 transition-colors">
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link href="/categorias" className="hover:text-blue-400 transition-colors">
                  Categorias
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-blue-400 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-semibold mb-4">Para Prestadores</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/prestador/cadastro" className="hover:text-blue-400 transition-colors">
                  Cadastre-se
                </Link>
              </li>
              <li>
                <Link href="/auth/signin" className="hover:text-blue-400 transition-colors">
                  Login Prestador
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {config.nomeEmpresa}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
