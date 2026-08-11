import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const banners = [
    {
      title: "BIYA Boutique",
      subtitle: "Nouvelle Collection 2026",
      description: "Decouvrez notre selection de vetements tendance. Qualite premium, prix accessible.",
      imageUrl: "/assets/img/fashion.jpg",
      sortOrder: 0,
      isActive: true,
    },
    {
      title: "Style & Elegance",
      subtitle: "Pour toutes les occasions",
      description: "Des tenues adaptees a votre quotidien, du bureau aux soirees.",
      imageUrl: "/assets/img/elegance.png",
      sortOrder: 1,
      isActive: true,
    },
    {
      title: "Livraison Gratuite",
      subtitle: "Des 50 DT d'achat",
      description: "Profitez de la livraison offerte sur toute la Tunisie. Retours gratuits sous 30 jours.",
      imageUrl: "/assets/img/banner_img_03.jpg",
      sortOrder: 2,
      isActive: true,
    },
  ]

  for (const banner of banners) {
    await prisma.banner.create({ data: banner })
  }

  console.log('✅ 3 bannieres creees avec succes')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })