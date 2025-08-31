
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const {
      categoryId,
      businessName,
      description,
      experience,
      certifications,
      workingHours,
      serviceAreas,
      priceRange
    } = body

    if (!categoryId || !description || serviceAreas?.length === 0) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: categoryId, description, serviceAreas' },
        { status: 400 }
      )
    }

    // Check if user already has a service provider profile
    const existingProvider = await prisma.serviceProvider.findUnique({
      where: { userId: (session.user as any).id }
    })

    if (existingProvider) {
      return NextResponse.json(
        { error: 'Usuário já possui um perfil de prestador' },
        { status: 400 }
      )
    }

    // Find category by slug
    const category = await prisma.serviceCategory.findUnique({
      where: { slug: categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada' },
        { status: 400 }
      )
    }

    // Update user type to SERVICE_PROVIDER
    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { userType: 'SERVICE_PROVIDER' }
    })

    // Create service provider profile
    const provider = await prisma.serviceProvider.create({
      data: {
        userId: (session.user as any).id,
        categoryId: category.id,
        businessName: businessName || null,
        description,
        experience: experience || null,
        certifications: certifications || null,
        workingHours: workingHours || null,
        serviceAreas: serviceAreas || [],
        priceRange: priceRange || null,
        images: [],
        isVerified: false,
        isActive: true,
        hasPendingPayment: false
      }
    })

    return NextResponse.json({
      message: 'Cadastro de prestador realizado com sucesso',
      provider: {
        id: provider.id,
        businessName: provider.businessName,
        category: category.name
      }
    })
  } catch (error) {
    console.error('Provider registration error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
