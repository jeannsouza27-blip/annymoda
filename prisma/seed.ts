import { PrismaClient, CouponType, BannerPlacement } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const categories = [
  {
    name: "Blazers",
    slug: "blazers",
    description: "Alfaiataria impecável para liderar com presença.",
    imageUrl: "https://picsum.photos/seed/anny-cat-blazers/900/1100",
  },
  {
    name: "Blusas",
    slug: "blusas",
    description: "Peças fluidas que unem conforto e sofisticação.",
    imageUrl: "https://picsum.photos/seed/anny-cat-blusas/900/1100",
  },
  {
    name: "Calças",
    slug: "calcas",
    description: "Modelagens precisas para o dia a dia executivo.",
    imageUrl: "https://picsum.photos/seed/anny-cat-calcas/900/1100",
  },
  {
    name: "Conjuntos",
    slug: "conjuntos",
    description: "Looks completos, prontos para grandes decisões.",
    imageUrl: "https://picsum.photos/seed/anny-cat-conjuntos/900/1100",
  },
]

const productNames: Record<string, string[]> = {
  blazers: [
    "Blazer Alfaiataria Essencial",
    "Blazer Cropped Executivo",
    "Blazer Duplo Botão Premium",
    "Blazer Oversized Cinza Grafite",
    "Blazer Acinturado Preto",
  ],
  blusas: [
    "Blusa Seda Manga Longa",
    "Blusa Gola Laço Marfim",
    "Blusa Alfaiataria Sem Manga",
    "Blusa Tricot Dourada",
    "Blusa Amarração Frontal",
  ],
  calcas: [
    "Calça Alfaiataria Pantalona",
    "Calça Reta Premium",
    "Calça Cintura Alta Bege",
    "Calça Cigarrete Preta",
    "Calça Wide Leg Executiva",
  ],
  conjuntos: [
    "Conjunto Blazer & Calça Preto",
    "Conjunto Alfaiataria Bege",
    "Conjunto Cropped & Saia Midi",
    "Conjunto Executivo Dourado",
  ],
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

async function main() {
  console.log("Seeding database...")

  await prisma.wishlistItem.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.shippingRule.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.newsletterSubscriber.deleteMany()
  await prisma.passwordResetToken.deleteMany()
  await prisma.user.deleteMany()

  const createdCategories = await Promise.all(
    categories.map((c, i) =>
      prisma.category.create({ data: { ...c, position: i } })
    )
  )

  let counter = 0
  for (const category of createdCategories) {
    const names = productNames[category.slug] ?? []
    for (const [index, name] of names.entries()) {
      counter += 1
      const priceCents = 39900 + ((counter * 3700) % 42000)
      const onSale = counter % 4 === 0
      const isFeatured = counter % 3 === 0
      const daysAgo = counter % 5 === 0 ? counter : counter * 9
      const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
      const slug = `${slugify(name)}-${category.slug}-${index}`

      await prisma.product.create({
        data: {
          name,
          slug,
          description:
            "Peça desenvolvida em tecido nobre, com caimento estudado para transmitir autoridade e elegância em qualquer ambiente corporativo. Modelagem exclusiva Anny Moda Executiva.",
          priceCents,
          compareAtPriceCents: onSale ? Math.round(priceCents * 1.25) : null,
          stock: 12 + (counter % 8),
          categoryId: category.id,
          isFeatured,
          installmentsMax: 10,
          createdAt,
          images: {
            create: [
              {
                url: `https://picsum.photos/seed/anny-${category.slug}-${index}-a/900/1200`,
                altText: name,
                isPrimary: true,
                position: 0,
              },
              {
                url: `https://picsum.photos/seed/anny-${category.slug}-${index}-b/900/1200`,
                altText: name,
                isPrimary: false,
                position: 1,
              },
            ],
          },
        },
      })
    }
  }

  const adminPasswordPlain = "AnnyAdmin@2026"
  const adminPasswordHash = await bcrypt.hash(adminPasswordPlain, 10)
  await prisma.user.create({
    data: {
      name: "Administração Anny",
      email: "admin@annymoda.com.br",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  })

  const customerPasswordHash = await bcrypt.hash("Cliente@2026", 10)
  const customer = await prisma.user.create({
    data: {
      name: "Camila Rezende",
      email: "cliente@exemplo.com.br",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
      phone: "11999990000",
      addresses: {
        create: {
          label: "Casa",
          recipientName: "Camila Rezende",
          phone: "11999990000",
          zipCode: "01415-000",
          street: "Rua das Palmeiras",
          number: "482",
          neighborhood: "Jardim Paulista",
          city: "São Paulo",
          state: "SP",
          isDefault: true,
        },
      },
    },
  })

  const someProduct = await prisma.product.findFirst()
  if (someProduct) {
    await prisma.order.create({
      data: {
        orderNumber: "AM-100001",
        userId: customer.id,
        status: "DELIVERED",
        paymentMethod: "PIX",
        subtotalCents: someProduct.priceCents,
        shippingCents: 2500,
        discountCents: 0,
        totalCents: someProduct.priceCents + 2500,
        recipientName: "Camila Rezende",
        phone: "11999990000",
        zipCode: "01415-000",
        street: "Rua das Palmeiras",
        number: "482",
        neighborhood: "Jardim Paulista",
        city: "São Paulo",
        state: "SP",
        trackingCode: "BR123456789BR",
        items: {
          create: {
            productId: someProduct.id,
            productNameSnapshot: someProduct.name,
            unitPriceCentsSnapshot: someProduct.priceCents,
            quantity: 1,
            totalCents: someProduct.priceCents,
          },
        },
      },
    })
  }

  const testimonials = [
    {
      authorName: "Camila Rezende",
      rating: 5,
      title: "Atendimento impecável",
      comment:
        "Me senti acolhida do início ao fim. Cada peça foi escolhida a dedo pensando no meu dia a dia como diretora. Elegância de verdade.",
    },
    {
      authorName: "Fernanda Bittencourt",
      rating: 5,
      title: "Qualidade que se vê e se sente",
      comment:
        "Os tecidos são incríveis e o caimento é perfeito. Recebo elogios toda vez que uso um look da Anny em reuniões importantes.",
    },
    {
      authorName: "Renata Souza",
      rating: 5,
      title: "Virei cliente fiel",
      comment:
        "O conjunto que comprei virou meu uniforme de sucesso. Atendimento personalizado que faz toda a diferença.",
    },
    {
      authorName: "Patrícia Andrade",
      rating: 4,
      title: "Sofisticação acessível",
      comment:
        "Encontrei peças versáteis que vão do escritório a jantares de negócios sem esforço. Recomendo de olhos fechados.",
    },
  ]

  for (const t of testimonials) {
    await prisma.review.create({
      data: { ...t, isApproved: true, isFeaturedTestimonial: true },
    })
  }

  await prisma.banner.create({
    data: {
      title: "Elegância para mulheres que lideram.",
      subtitle: "Nova coleção de alfaiataria executiva",
      imageUrl: "https://picsum.photos/seed/anny-hero-main/1920/1080",
      ctaLabel: "Comprar Agora",
      ctaHref: "/novidades",
      placement: BannerPlacement.HERO,
      position: 0,
    },
  })

  await prisma.coupon.create({
    data: {
      code: "BEMVINDA10",
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrderCents: 0,
      isActive: true,
    },
  })

  await prisma.shippingRule.createMany({
    data: [
      {
        name: "São Paulo - Capital",
        state: "SP",
        priceCents: 1500,
        estimatedDaysMin: 1,
        estimatedDaysMax: 3,
      },
      {
        name: "Demais estados",
        state: null,
        priceCents: 3500,
        estimatedDaysMin: 4,
        estimatedDaysMax: 10,
      },
    ],
  })

  await prisma.newsletterSubscriber.createMany({
    data: [
      { email: "assinante1@exemplo.com.br", isConfirmed: true },
      { email: "assinante2@exemplo.com.br", isConfirmed: true },
    ],
  })

  console.log("Seed concluído.")
  console.log("---------------------------------------------")
  console.log("Login administrativo:")
  console.log("  email:", "admin@annymoda.com.br")
  console.log("  senha:", adminPasswordPlain)
  console.log("Login de cliente de teste:")
  console.log("  email:", "cliente@exemplo.com.br")
  console.log("  senha:", "Cliente@2026")
  console.log("---------------------------------------------")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
