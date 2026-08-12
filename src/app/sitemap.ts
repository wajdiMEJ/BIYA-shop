import { prisma } from "@/lib/db/prisma"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://biya-shop.vercel.app"

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true }
  })

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produits/${product.slug}`,
    lastModified: product.updatedAt,
  }))

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