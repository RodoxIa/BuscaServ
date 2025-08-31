
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    
    const categoria = searchParams.get('categoria')
    const cidade = searchParams.get('cidade')
    const minRating = searchParams.get('minRating')
    const verificado = searchParams.get('verificado') === 'true'
    const busca = searchParams.get('busca')

    // Build where condition
    const where: any = {
      isActive: true,
      hasPendingPayment: false
    }

    if (categoria) {
      where.category = {
        slug: categoria
      }
    }

    if (cidade) {
      where.OR = [
        { user: { city: cidade } },
        { serviceAreas: { has: cidade } }
      ]
    }

    if (minRating) {
      where.avgRating = {
        gte: parseFloat(minRating)
      }
    }

    if (verificado) {
      where.isVerified = true
    }

    if (busca) {
      where.OR = [
        { businessName: { contains: busca, mode: 'insensitive' } },
        { user: { name: { contains: busca, mode: 'insensitive' } } },
        { description: { contains: busca, mode: 'insensitive' } }
      ]
    }

    const providers = await prisma.serviceProvider.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            city: true
          }
        },
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: [
        { avgRating: 'desc' },
        { totalReviews: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 50 // Limit results
    })

    return NextResponse.json({
      providers,
      total: providers.length
    })
  } catch (error) {
    console.error('Error fetching providers:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar prestadores' },
      { status: 500 }
    )
  }
}
