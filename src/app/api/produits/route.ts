import { prisma } from "@/lib/db/prisma"
import { NextResponse } from "next/server"
import { notifyNewProduct } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      name,
      slug,
      description,
      price,
      salePrice,
      saleStartDate,
      saleEndDate,
      stock,
      sku,
      categoryId,
      imageUrls,
      variants,
    } = body

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        salePrice: salePrice || null,
        saleStartDate: saleStartDate ? new Date(saleStartDate) : null,
        saleEndDate: saleEndDate ? new Date(saleEndDate) : null,
        stock,
        sku,
        categoryId,
        isActive: true,
        images: {
          create: imageUrls.map((url: string, i: number) => ({
            url,
            isPrimary: i === 0,
            alt: name,
            sortOrder: i,
          }))
        },
        variants: {
          create: variants.map((v: any) => ({
            size: v.size,
            color: v.color || 'Standard',
            stock: v.stock,
            sku: v.sku,
            isActive: true,
          }))
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
        notifyNewProduct(user.email, name).catch(console.error)
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || "Erreur création" }, { status: 500 })
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