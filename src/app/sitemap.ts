import { prisma } from "@/lib/db/prisma"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://biya-shop.vercel.app"

  let productUrls: MetadataRoute.Sitemap = []

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    })

    productUrls = products.map((product) => ({
      url: `${baseUrl}/produits/${product.slug}`,
      lastModified: product.updatedAt,
    }))
  } catch (error) {
    console.error("Erreur chargement produits pour sitemap:", error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/produits`,
      lastModified: new Date(),
    },
    ...productUrls,
  ]
}