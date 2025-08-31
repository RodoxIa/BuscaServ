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
      where: { serviceProviderId: serviceProvider.id },
      orderBy: { datePerformed: 'desc' }
    })

    return NextResponse.json(clientRecords)
  } catch (error) {
    console.error('Erro ao buscar registros de clientes:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { clientName, clientEmail, clientPhone, serviceType, value, datePerformed } = body

    // Validar dados obrigatórios
    if (!clientName || !serviceType || !value) {
      return NextResponse.json({ error: 'Nome do cliente, tipo de serviço e valor são obrigatórios' }, { status: 400 })
    }

    // Criar novo registro de cliente
    const clientRecord = await prisma.clientRecord.create({
      data: {
        serviceProviderId: serviceProvider.id,
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        serviceType,
        value: parseFloat(value),
        datePerformed: datePerformed ? new Date(datePerformed) : new Date()
      }
    })

    return NextResponse.json(clientRecord, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar registro de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

