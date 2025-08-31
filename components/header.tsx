
'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, User, LogOut, Settings, Star } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="font-bold text-xl text-gray-900">BuscaServ</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <span>Home</span>
            </Link>
            <Link href="/buscar" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Search className="w-4 h-4" />
              <span>Buscar Profissionais</span>
            </Link>
            {session?.user && (session.user as any).userType === 'SERVICE_PROVIDER' && (
              <Link href="/prestador/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors">
                Meu Painel
              </Link>
            )}
            {session?.user?.email === 'wrodoxia@gmail.com' && (
              <div className="flex items-center space-x-4">
                <Link href="/admin/cidades" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Cidades
                </Link>
                <Link href="/admin/ramos" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Ramos
                </Link>
                <Link href="/admin/configuracoes" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Config
                </Link>
              </div>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="h-10 w-10 animate-pulse bg-gray-200 rounded-full"></div>
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/perfil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  {(session.user as any).userType === 'SERVICE_PROVIDER' && (
                    <DropdownMenuItem asChild>
                      <Link href="/prestador/dashboard">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Painel Prestador</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/minhas-avaliacoes">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Minhas Avaliações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/auth/signin">Entrar</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/signup-usuario">Cadastrar</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup-prestador">Sou Prestador</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
