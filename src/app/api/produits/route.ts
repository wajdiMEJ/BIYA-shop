import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import { notifyNewProduct } from "@/lib/email"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1).max(200).trim(),
  slug: z.string().min(1).max(200).trim(),
  description: z.string().max(2000).optional(),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),        // ← AJOUTE CECI
  stock: z.number().int().min(0),
  sku: z.string().min(1).max(100),
  categoryId: z.string().uuid(),
  imageUrl: z.string().url().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 })
    }

    const data = result.data

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        salePrice: data.salePrice || null,              // ← AJOUTE CECI
        stock: data.stock,
        sku: data.sku,
        categoryId: data.categoryId,
        isActive: true,
        images: {
          create: {
            url: data.imageUrl || '/assets/img/placeholder.jpg',
            isPrimary: true,
            alt: data.name,
          }
        }
      }
    })

    // 🔔 Notifier tous les clients par email
    const users = await prisma.user.findMany({
      where: { role: 'USER' },
      select: { email: true }
    })

    users.forEach(user => {
      if (user.email) {
        notifyNewProduct(user.email, data.name).catch(console.error)
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Erreur création" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      include: { images: true, category: true },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Erreur chargement" }, { status: 500 })
  }
}