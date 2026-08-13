import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

// ✅ GET : Récupérer un produit
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        variants: true,
        reviews: { include: { user: true } },  // ← CORRIGÉ : plus de select name
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur chargement' }, { status: 500 })
  }
}

// ✅ PUT : Mettre à jour un produit
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const {
      name,
      slug,
      description,
      price,
      salePrice,
      stock,
      sku,
      categoryId,
      isActive,
      newImages,
      variants,
    } = body

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        price,
        salePrice: salePrice || null,
        stock,
        sku,
        categoryId: categoryId || null,
        isActive,
      },
    })

    if (newImages && newImages.length > 0) {
      await prisma.productImage.createMany({
        data: newImages.map((url: string, index: number) => ({
          url,
          productId: id,
          isPrimary: index === 0,
          alt: name,
        })),
      })
    }

    if (variants && variants.length > 0) {
      await prisma.productVariant.deleteMany({ where: { productId: id } })
      await prisma.productVariant.createMany({
        data: variants.map((v: { size: string; stock: number }) => ({
          size: v.size,
          stock: v.stock,
          productId: id,
        })),
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
  }
}

// ✅ DELETE : Supprimer un produit
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.productImage.deleteMany({ where: { productId: id } })
    await prisma.productVariant.deleteMany({ where: { productId: id } })
    await prisma.orderItem.deleteMany({ where: { productId: id } })
    await prisma.review.deleteMany({ where: { productId: id } })
    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
  }
}