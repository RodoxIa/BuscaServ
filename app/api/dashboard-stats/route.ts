import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar o prestador de serviços
    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: { userId: session.user.id }
    })

    if (!serviceProvider) {
      return NextResponse.json({ error: 'Prestador não encontrado' }, { status: 404 })
    }

    // Buscar registros de clientes
    const clientRecords = await prisma.clientRecord.findMany({
      where: { serviceProviderId: serviceProvider.id }
    })

    // Calcular estatísticas
    const totalClients = clientRecords.length
    const totalRevenue = clientRecords.reduce((sum, record) => sum + record.value, 0)
    
    // Agrupar por tipo de serviço
    const serviceTypes = clientRecords.reduce((acc, record) => {
      acc[record.serviceType] = (acc[record.serviceType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Receita por mês (últimos 6 meses)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const recentRecords = clientRecords.filter(record => 
      new Date(record.datePerformed) >= sixMonthsAgo
    )

    const monthlyRevenue = recentRecords.reduce((acc, record) => {
      const month = new Date(record.datePerformed).toISOString().slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + record.value
      return acc
    }, {} as Record<string, number>)

    // Clientes por mês
    const monthlyClients = recentRecords.reduce((acc, record) => {
      const month = new Date(record.datePerformed).toISOString().slice(0, 7) // YYYY-MM
      acc[month] = (acc[month] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return NextResponse.json({
      totalClients,
      totalRevenue,
      serviceTypes,
      monthlyRevenue,
      monthlyClients,
      averageServiceValue: totalClients > 0 ? totalRevenue / totalClients : 0
    })
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

