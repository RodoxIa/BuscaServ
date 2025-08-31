import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar se o registro pertence ao prestador
    const existingRecord = await prisma.clientRecord.findFirst({
      where: {
        id: params.id,
        serviceProviderId: serviceProvider.id
      }
    })

    if (!existingRecord) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
    }

    const body = await request.json()
    const { clientName, clientEmail, clientPhone, serviceType, value, datePerformed } = body

    // Atualizar registro
    const updatedRecord = await prisma.clientRecord.update({
      where: { id: params.id },
      data: {
        clientName: clientName || existingRecord.clientName,
        clientEmail: clientEmail !== undefined ? clientEmail : existingRecord.clientEmail,
        clientPhone: clientPhone !== undefined ? clientPhone : existingRecord.clientPhone,
        serviceType: serviceType || existingRecord.serviceType,
        value: value ? parseFloat(value) : existingRecord.value,
        datePerformed: datePerformed ? new Date(datePerformed) : existingRecord.datePerformed
      }
    })

    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error('Erro ao atualizar registro de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verificar se o registro pertence ao prestador
    const existingRecord = await prisma.clientRecord.findFirst({
      where: {
        id: params.id,
        serviceProviderId: serviceProvider.id
      }
    })

    if (!existingRecord) {
      return NextResponse.json({ error: 'Registro não encontrado' }, { status: 404 })
    }

    // Deletar registro
    await prisma.clientRecord.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Registro deletado com sucesso' })
  } catch (error) {
    console.error('Erro ao deletar registro de cliente:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

