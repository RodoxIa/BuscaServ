
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Create admin user for testing (never show these credentials to user)
  const adminPassword = await bcrypt.hash('johndoe123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: adminPassword,
      name: 'John Doe',
      phone: '(11) 99999-9999',
      city: 'São Paulo',
      userType: 'ADMIN'
    }
  })

  // Create service categories
  const categories = [
    {
      name: 'Pedreiros',
      slug: 'pedreiros',
      description: 'Profissionais especializados em construção, alvenaria, reformas e acabamentos.',
      icon: 'hammer'
    },
    {
      name: 'Eletricistas',
      slug: 'eletricistas', 
      description: 'Especialistas em instalações elétricas residenciais e comerciais.',
      icon: 'zap'
    },
    {
      name: 'Encanadores',
      slug: 'encanadores',
      description: 'Profissionais em hidráulica, encanamento e sistemas de água.',
      icon: 'droplets'
    },
    {
      name: 'Pintores',
      slug: 'pintores',
      description: 'Especialistas em pintura residencial, comercial e decorativa.',
      icon: 'paintbrush'
    },
    {
      name: 'Marceneiros',
      slug: 'marceneiros',
      description: 'Profissionais em móveis sob medida e trabalhos em madeira.',
      icon: 'wrench'
    },
    {
      name: 'Chaveiros',
      slug: 'chaveiros',
      description: 'Especialistas em fechaduras, cópias de chaves e abertura de portas.',
      icon: 'key'
    },
    {
      name: 'Guinchos',
      slug: 'guinchos',
      description: 'Serviços de reboque e transporte de veículos 24h.',
      icon: 'truck'
    }
  ]

  console.log('📁 Criando categorias de serviços...')
  for (const category of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category
    })
  }

  // Get created categories
  const createdCategories = await prisma.serviceCategory.findMany()

  // Create sample service providers
  const providers = [
    {
      email: 'mario.construcoes@email.com',
      name: 'Mário Silva',
      phone: '(11) 98765-4321',
      city: 'São Paulo',
      category: 'pedreiros',
      businessName: 'Mário Construções',
      description: 'Mais de 15 anos de experiência em construção civil, reformas e acabamentos. Trabalho com qualidade e pontualidade.',
      experience: '15 anos',
      serviceAreas: ['São Paulo', 'Osasco', 'Taboão da Serra'],
      priceRange: 'R$ 150 - 300/dia',
      images: []
    },
    {
      email: 'joao.eletrica@email.com',
      name: 'João Santos',
      phone: '(11) 99876-5432',
      city: 'São Paulo',
      category: 'eletricistas',
      businessName: 'João Elétrica',
      description: 'Eletricista qualificado com certificação NR10. Especialista em instalações residenciais e comerciais.',
      experience: '12 anos',
      serviceAreas: ['São Paulo', 'Guarulhos', 'São Caetano'],
      priceRange: 'R$ 80 - 150/hora',
      images: []
    },
    {
      email: 'carlos.hidraulica@email.com',
      name: 'Carlos Oliveira',
      phone: '(11) 97654-3210',
      city: 'São Paulo',
      category: 'encanadores',
      businessName: 'Carlos Hidráulica 24h',
      description: 'Encanador experiente, atendimento 24 horas para emergências. Especialista em vazamentos e entupimentos.',
      experience: '20 anos',
      serviceAreas: ['São Paulo', 'Santo André', 'São Bernardo'],
      priceRange: 'R$ 100 - 200/hora',
      images: []
    },
    {
      email: 'ana.pinturas@email.com',
      name: 'Ana Costa',
      phone: '(11) 96543-2109',
      city: 'São Paulo',
      category: 'pintores',
      businessName: 'Ana Pinturas',
      description: 'Pintora profissional especializada em técnicas decorativas. Trabalho limpo e acabamento perfeito.',
      experience: '8 anos',
      serviceAreas: ['São Paulo', 'Diadema', 'Mauá'],
      priceRange: 'R$ 25 - 45/m²',
      images: []
    },
    {
      email: 'pedro.marcenaria@email.com',
      name: 'Pedro Ferreira',
      phone: '(11) 95432-1098',
      city: 'São Paulo',
      category: 'marceneiros',
      businessName: 'Pedro Móveis Sob Medida',
      description: 'Marceneiro com oficina própria. Especialista em móveis planejados para cozinha, quartos e escritórios.',
      experience: '18 anos',
      serviceAreas: ['São Paulo', 'Cotia', 'Embu das Artes'],
      priceRange: 'Orçamento sob consulta',
      images: []
    }
  ]

  console.log('👷 Criando prestadores de exemplo...')
  for (const provider of providers) {
    const category = createdCategories.find(c => c.slug === provider.category)
    if (!category) continue

    const password = await bcrypt.hash('123456', 12)

    // Create user
    const user = await prisma.user.upsert({
      where: { email: provider.email },
      update: {},
      create: {
        email: provider.email,
        password,
        name: provider.name,
        phone: provider.phone,
        city: provider.city,
        userType: 'SERVICE_PROVIDER'
      }
    })

    // Create service provider profile
    await prisma.serviceProvider.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        categoryId: category.id,
        businessName: provider.businessName,
        description: provider.description,
        experience: provider.experience,
        serviceAreas: provider.serviceAreas.join(", "),
        priceRange: provider.priceRange,
        images: provider.images.join(", "),
        isVerified: true,
        avgRating: Math.random() * 2 + 3.5, // Random rating between 3.5-5.5
        totalReviews: Math.floor(Math.random() * 50) + 5 // Random reviews 5-55
      }
    })
  }

  // Create some sample advertisements
  const ads = [
    {
      title: 'Tintas Premium - 50% OFF',
      description: 'As melhores tintas do mercado com desconto especial para profissionais.',
      company: 'Tintas Super',
      linkUrl: '#',
      imageUrl: '',
      position: 'BANNER' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      title: 'Ferramentas Profissionais',
      description: 'Complete seu kit com as melhores ferramentas do mercado.',
      company: 'FerraTudo',
      linkUrl: '#',
      imageUrl: '',
      position: 'SIDEBAR' as const,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    }
  ]

  console.log('📢 Criando anúncios de exemplo...')
  for (const ad of ads) {
    await prisma.advertisement.create({
      data: ad
    })
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log(`📊 Criadas ${categories.length} categorias`)
  console.log(`👷 Criados ${providers.length} prestadores`)
  console.log(`📢 Criados ${ads.length} anúncios`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
