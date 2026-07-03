import { PrismaClient, CouponType, BannerPlacement } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const uploads = (file: string) => `/uploads/products/${file}`

const categories = [
  {
    name: "Blazers",
    slug: "blazers",
    description: "Alfaiataria impecável para liderar com presença.",
    imageUrl: uploads("blazer-azul-serenity-calca-jeans.jpg.jpeg"),
  },
  {
    name: "Blusas",
    slug: "blusas",
    description: "Peças fluidas que unem conforto e sofisticação.",
    imageUrl: uploads("blusa-frente-unica-off-white-calca-flare-vinho.jpg.jpeg"),
  },
  {
    name: "Calças",
    slug: "calcas",
    description: "Modelagens precisas para o dia a dia executivo.",
    imageUrl: uploads("blusa-frente-unica-terracota-calca-pantalona-preta.jpg.jpeg"),
  },
  {
    name: "Conjuntos",
    slug: "conjuntos",
    description: "Looks completos, prontos para grandes decisões.",
    imageUrl: uploads("conjunto-alfaiataria-vinho-blazer-calca-flare.jpg.jpeg"),
  },
]

const realProducts: {
  file: string
  category: string
  name: string
  description: string
}[] = [
  {
    file: "blazer-azul-serenity-calca-jeans.jpg.jpeg",
    category: "blazers",
    name: "Blazer Azul Serenity com Calça Jeans",
    description:
      "Blazer alfaiatado em azul serenity, caimento estruturado e botões dourados, combinado com calça jeans wide leg para um look executivo com toque descontraído.",
  },
  {
    file: "blazer-verde-militar-blusa-branca-jeans.jpg.jpeg",
    category: "blazers",
    name: "Blazer Verde Militar com Blusa Branca",
    description:
      "Blazer alfaiatado verde militar sobre blusa branca básica e calça jeans reta, uma combinação versátil para o dia a dia corporativo.",
  },
  {
    file: "colete-alfaiataria-caramelo-body-marrom-jeans.jpg.jpeg",
    category: "blazers",
    name: "Colete Alfaiataria Caramelo com Body Marrom",
    description:
      "Colete de alfaiataria caramelo sobreposto a body marrom, finalizado com calça jeans wide leg — sobreposição elegante para compor looks autorais.",
  },
  {
    file: "blusa-babados-preta-calca-alfaiataria-azul-marinho.jpg.jpeg",
    category: "blusas",
    name: "Blusa Babados Preta com Calça Azul Marinho",
    description:
      "Blusa preta com babados nas mangas e gola V, combinada com calça de alfaiataria azul marinho de cintura alta e cinto.",
  },
  {
    file: "blusa-babados-preta-calca-alfaiataria-azul-royal.jpg.jpeg",
    category: "blusas",
    name: "Blusa Babados Preta com Calça Azul Royal",
    description:
      "Blusa preta com babados nas mangas e gola V, combinada com calça de alfaiataria azul royal de cintura alta e cinto.",
  },
  {
    file: "blusa-babados-preta-calca-alfaiataria-preta.jpg.jpeg",
    category: "blusas",
    name: "Blusa Babados Preta com Calça Preta",
    description:
      "Look monocromático com blusa preta de babados nas mangas e calça de alfaiataria preta de cintura alta.",
  },
  {
    file: "blusa-babados-preta-calca-alfaiataria-rose.jpg.jpeg",
    category: "blusas",
    name: "Blusa Babados Preta com Calça Rose",
    description:
      "Blusa preta com babados nas mangas e gola V, combinada com calça de alfaiataria rose de cintura alta e cinto.",
  },
  {
    file: "blusa-frente-unica-off-white-calca-flare-vinho.jpg.jpeg",
    category: "blusas",
    name: "Blusa Frente Única Off White com Calça Flare Vinho",
    description:
      "Blusa frente única off white com pregas frontais, combinada com calça flare vinho de cintura alta e cinto — elegância para ocasiões especiais.",
  },
  {
    file: "blusa-frente-unica-terracota-calca-pantalona-preta.jpg.jpeg",
    category: "calcas",
    name: "Calça Pantalona Preta com Blusa Terracota",
    description:
      "Calça pantalona preta de cintura alta, combinada com blusa frente única terracota com pregas frontais.",
  },
  {
    file: "conjunto-alfaiataria-vinho-blazer-calca-flare.jpg.jpeg",
    category: "conjuntos",
    name: "Conjunto Alfaiataria Vinho Blazer e Calça Flare",
    description:
      "Conjunto completo de alfaiataria vinho, blazer estruturado com botões dourados e calça flare, para quando a ocasião pede autoridade e sofisticação.",
  },
]

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

  const categoryBySlug = new Map(createdCategories.map((c) => [c.slug, c]))

  let counter = 0
  for (const [index, item] of realProducts.entries()) {
    const category = categoryBySlug.get(item.category)
    if (!category) continue

    counter += 1
    const priceCents = 39900 + ((counter * 3700) % 42000)
    const onSale = counter % 4 === 0
    const isFeatured = counter % 3 === 0
    const daysAgo = counter % 5 === 0 ? counter : counter * 9
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    const slug = `${slugify(item.name)}-${index}`

    await prisma.product.create({
      data: {
        name: item.name,
        slug,
        description: item.description,
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
              url: uploads(item.file),
              altText: item.name,
              isPrimary: true,
              position: 0,
            },
          ],
        },
      },
    })
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
      imageUrl: "/uploads/banner-home.png",
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
